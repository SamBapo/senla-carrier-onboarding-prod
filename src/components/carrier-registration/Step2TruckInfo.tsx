import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PROVINCE_OPTIONS, REGIONS, REGION_TRANSLATIONS } from "@/data/provinces";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export type Step2FormData = {
  truckTypes: string[];
  capacities?: Record<string, Record<string, number | string>>;
  coverage: string[];
};

interface Step2Props {
  data: Partial<Step2FormData>;
  onNext: (data: Step2FormData) => void;
  onBack: () => void;
  language?: "en" | "vi";
}

export const Step2TruckInfo = ({ data, onNext, onBack, language = "en" }: Step2Props) => {
  const [selectedTruckTypes, setSelectedTruckTypes] = useState<string[]>(
    data.truckTypes || []
  );
  const [existingTrucks, setExistingTrucks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingTrucks();
  }, []);

  const checkExistingTrucks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: carrier } = await supabase
        .from("carriers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (carrier) {
        const { data: trucks } = await supabase
          .from("trucks")
          .select("*")
          .eq("carrier_id", carrier.id);
        
        setExistingTrucks(trucks || []);
      }
    } catch (error) {
      console.error("Error checking existing trucks:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasTrucks = existingTrucks.length > 0;

  const translations = {
    en: {
      title: "Truck Information",
      subtitle: "Add your trucks and coverage.",
      bannerMessage: "You can no longer edit truck capacities here. Please add or remove trucks in My Truck Overview.",
      truckType: "Truck Type",
      selectTruckType: "Select truck type",
      dry: "Dry (Ambient)",
      chilled: "Chilled (2–8°C)",
      frozen: "Frozen (–18°C)",
      typeCapacity: "Type Capacity",
      typeCapacityDesc: "How many trucks do you have of each capacity?",
      coverageArea: "Coverage Area",
      selectCoverage: "Select coverage",
      back: "Back",
      continue: "Continue",
      errors: {
        minTruckType: "Select at least one truck type",
        minCoverage: "Select at least one coverage area",
      }
    },
    vi: {
      title: "Thông tin xe tải",
      subtitle: "Thêm thông tin về đội xe và khu vực phủ sóng.",
      bannerMessage: "Bạn không thể chỉnh sửa sức chứa xe tại đây nữa. Vui lòng thêm hoặc xóa xe trong Tổng quan xe của tôi.",
      truckType: "Loại xe",
      selectTruckType: "Chọn loại xe",
      dry: "Khô (Nhiệt độ thường)",
      chilled: "Mát (2–8°C)",
      frozen: "Đông lạnh (–18°C)",
      typeCapacity: "Sức chứa theo loại",
      typeCapacityDesc: "Bạn có bao nhiêu xe cho mỗi sức chứa?",
      coverageArea: "Khu vực phủ sóng",
      selectCoverage: "Chọn khu vực",
      back: "Quay lại",
      continue: "Tiếp tục",
      errors: {
        minTruckType: "Chọn ít nhất một loại xe",
        minCoverage: "Chọn ít nhất một khu vực",
      }
    }
  };

  const t = translations[language];

  const TRUCK_TYPES = [
    { value: "ambient", label: t.dry },
    { value: "refrigerated", label: t.chilled },
    { value: "frozen", label: t.frozen },
  ];

  const CAPACITY_OPTIONS = [
    { value: "<3_5t", label: "<3.5t", displayValue: "<3.5t" },
    { value: "3_5-5t", label: "3.5–5t", displayValue: "3.5-5t" },
    { value: "5-8t", label: "5–8t", displayValue: "5-8t" },
    { value: "8-10t", label: "8–10t", displayValue: "8-10t" },
    { value: "10-15t", label: "10–15t", displayValue: "10-15t" },
    { value: ">15t", label: ">15t", displayValue: ">15t" },
  ];

  const formSchema = z.object({
    truckTypes: z.array(z.string()).min(1, t.errors.minTruckType),
    capacities: z.any().optional(),
    coverage: z.array(z.string()).min(1, t.errors.minCoverage),
  });

  const form = useForm<Step2FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      truckTypes: data.truckTypes || [],
      capacities: data.capacities || {},
      coverage: data.coverage || [],
    },
  });

  // Reset form when data changes (when navigating back to this step)
  useEffect(() => {
    if (data.truckTypes) {
      setSelectedTruckTypes(data.truckTypes);
    }
    form.reset({
      truckTypes: data.truckTypes || [],
      capacities: data.capacities || {},
      coverage: data.coverage || [],
    });
  }, [data]);

  const handleRegionToggle = (region: string, checked: boolean) => {
    const regionProvinces = PROVINCE_OPTIONS.filter((p) => p.region === region).map(
      (p) => p.value
    );
    const currentCoverage = form.getValues("coverage");

    if (checked) {
      const newCoverage = [...new Set([...currentCoverage, ...regionProvinces])];
      form.setValue("coverage", newCoverage);
    } else {
      const newCoverage = currentCoverage.filter(
        (p) => !regionProvinces.includes(p)
      );
      form.setValue("coverage", newCoverage);
    }
  };

  const isRegionSelected = (region: string) => {
    const regionProvinces = PROVINCE_OPTIONS.filter((p) => p.region === region).map(
      (p) => p.value
    );
    const currentCoverage = form.watch("coverage");
    return regionProvinces.every((p) => currentCoverage.includes(p));
  };

  const handleTruckTypeChange = (value: string[]) => {
    setSelectedTruckTypes(value);
    form.setValue("truckTypes", value);
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">
          {t.title}
        </h2>
        <p className="text-muted-foreground mt-1">
          {t.subtitle}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-8">
          {hasTrucks && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>{t.bannerMessage}</AlertDescription>
            </Alert>
          )}

          {/* Truck Type Selection */}
          <FormField
            control={form.control}
            name="truckTypes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.truckType} *</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="multiple"
                    value={selectedTruckTypes}
                    onValueChange={handleTruckTypeChange}
                    className="justify-start flex-wrap gap-3"
                    disabled={hasTrucks}
                  >
                    {TRUCK_TYPES.map((type) => (
                      <ToggleGroupItem
                        key={type.value}
                        value={type.value}
                        className="px-6 py-6 text-sm border-2 bg-muted/50 hover:bg-muted data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
                      >
                        {type.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Capacity Selection - Only show for selected truck types */}
          {selectedTruckTypes.length > 0 && (
            <div className="space-y-6">
              <div>
                <FormLabel>{t.typeCapacity}</FormLabel>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.typeCapacityDesc}
                </p>
              </div>
              {selectedTruckTypes.map((truckType) => {
                const truckTypeLabel = TRUCK_TYPES.find(t => t.value === truckType)?.label;
                const isChilled = truckType === "refrigerated";
                const isFrozen = truckType === "frozen";
                const isAmbient = truckType === "ambient";
                
                return (
                  <div 
                    key={truckType} 
                    className={`space-y-4 p-4 rounded-lg border-2 ${
                      isChilled 
                        ? "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800" 
                        : isFrozen 
                          ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-800"
                          : "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        isChilled 
                          ? "bg-blue-500" 
                          : isFrozen 
                            ? "bg-indigo-600"
                            : "bg-amber-500"
                      }`} />
                      <h4 className={`text-sm font-semibold ${
                        isChilled 
                          ? "text-blue-700 dark:text-blue-300" 
                          : isFrozen 
                            ? "text-indigo-700 dark:text-indigo-300"
                            : "text-amber-700 dark:text-amber-300"
                      }`}>
                        {truckTypeLabel}
                      </h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {CAPACITY_OPTIONS.map((capacity) => (
                        <FormField
                          key={`${truckType}.${capacity.value}`}
                          control={form.control}
                          name={`capacities.${truckType}.${capacity.value}` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-normal">
                                {capacity.label}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  className="bg-white dark:bg-background"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value === "" ? "" : value);
                                  }}
                                  disabled={hasTrucks}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Coverage Area */}
          <FormField
            control={form.control}
            name="coverage"
            render={() => (
              <FormItem>
                <FormLabel>{t.coverageArea} *</FormLabel>
                <div className="space-y-4">
                  {REGIONS.map((region) => {
                    const regionProvinces = PROVINCE_OPTIONS.filter(
                      (p) => p.region === region
                    );
                    return (
                      <div key={region} className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={region}
                            checked={isRegionSelected(region)}
                            onCheckedChange={(checked) =>
                              handleRegionToggle(region, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={region}
                            className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {REGION_TRANSLATIONS[language][region]}
                          </label>
                        </div>
                        <div className="ml-6 grid grid-cols-3 gap-3">
                          {regionProvinces.map((province) => (
                            <FormField
                              key={province.value}
                              control={form.control}
                              name="coverage"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={province.value}
                                    className="flex flex-row items-center space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          province.value
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                province.value,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== province.value
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-xs font-normal">
                                      {province.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              {t.back}
            </Button>
            <Button type="submit" size="lg">
              {t.continue}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
