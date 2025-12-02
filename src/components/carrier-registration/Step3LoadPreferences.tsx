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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

export type Step3FormData = {
  ftl: boolean;
  ltl: boolean;
  temperatures: {
    dry: boolean;
    chilled: boolean;
    frozen: boolean;
  };
  minimumLoad?: number;
  palletized: boolean;
  nonPalletized: boolean;
  comments?: string;
};

interface Step3Props {
  data: Partial<Step3FormData>;
  onNext: (data: Step3FormData) => void;
  onBack: () => void;
  language?: "en" | "vi";
}

export const Step3LoadPreferences = ({ data, onNext, onBack, language = "en" }: Step3Props) => {
  const translations = {
    en: {
      title: "Load Preferences",
      loadType: "Load Type",
      ftl: "FTL (Full Truck Load)",
      ltl: "LTL (Less Than Truck Load)",
      temperatureRequirements: "Temperature Requirements",
      dry: "Dry",
      chilled: "Chilled",
      frozen: "Frozen",
      minimumLoad: "Minimum Load (kg)",
      minimumLoadPlaceholder: "Enter minimum load",
      packaging: "Packaging",
      palletized: "Palletized",
      nonPalletized: "Non-Palletized",
      additionalComments: "Additional Comments",
      commentsPlaceholder: "Any specific requirements or notes...",
      back: "Back",
      continue: "Continue",
      errors: {
        minLoadType: "Select at least one: FTL or LTL",
        minTemperature: "Select at least one temperature type",
      }
    },
    vi: {
      title: "Ưu tiên vận chuyển",
      loadType: "Loại hàng",
      ftl: "FTL (Hàng nguyên xe)",
      ltl: "LTL (Hàng lẻ)",
      temperatureRequirements: "Yêu cầu nhiệt độ",
      dry: "Khô",
      chilled: "Mát",
      frozen: "Đông lạnh",
      minimumLoad: "Tải trọng tối thiểu (kg)",
      minimumLoadPlaceholder: "Nhập tải trọng tối thiểu",
      packaging: "Đóng gói",
      palletized: "Có pallet",
      nonPalletized: "Không pallet",
      additionalComments: "Ghi chú thêm",
      commentsPlaceholder: "Yêu cầu cụ thể hoặc ghi chú...",
      back: "Quay lại",
      continue: "Tiếp tục",
      errors: {
        minLoadType: "Chọn ít nhất một: FTL hoặc LTL",
        minTemperature: "Chọn ít nhất một loại nhiệt độ",
      }
    }
  };

  const t = translations[language];

  const formSchema = z.object({
    ftl: z.boolean(),
    ltl: z.boolean(),
    temperatures: z.object({
      dry: z.boolean(),
      chilled: z.boolean(),
      frozen: z.boolean(),
    }),
    minimumLoad: z.number().min(0).optional(),
    palletized: z.boolean(),
    nonPalletized: z.boolean(),
    comments: z.string().optional(),
  }).refine(
    (data) => data.ftl || data.ltl,
    {
      message: t.errors.minLoadType,
      path: ["ftl"],
    }
  ).refine(
    (data) => data.temperatures.dry || data.temperatures.chilled || data.temperatures.frozen,
    {
      message: t.errors.minTemperature,
      path: ["temperatures"],
    }
  );

  const form = useForm<Step3FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ftl: data.ftl || false,
      ltl: data.ltl || false,
      temperatures: data.temperatures || {
        dry: false,
        chilled: false,
        frozen: false,
      },
      minimumLoad: data.minimumLoad !== undefined ? data.minimumLoad : undefined,
      palletized: data.palletized || false,
      nonPalletized: data.nonPalletized || false,
      comments: data.comments || "",
    },
  });

  // Reset form when data changes (when navigating back to this step)
  useEffect(() => {
    form.reset({
      ftl: data.ftl || false,
      ltl: data.ltl || false,
      temperatures: data.temperatures || {
        dry: false,
        chilled: false,
        frozen: false,
      },
      minimumLoad: data.minimumLoad !== undefined ? data.minimumLoad : undefined,
      palletized: data.palletized || false,
      nonPalletized: data.nonPalletized || false,
      comments: data.comments || "",
    });
  }, [data]);

  return (
    <div className="bg-card rounded-lg shadow-sm border p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">
          {t.title}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-8">
          {/* Load Type */}
          <div className="space-y-4">
            <FormLabel>{t.loadType} *</FormLabel>
            <div className="flex gap-8">
              <FormField
                control={form.control}
                name="ftl"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      {t.ftl}
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ltl"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      {t.ltl}
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Temperature Requirements */}
          <div className="space-y-4">
            <FormLabel>{t.temperatureRequirements} *</FormLabel>
            <div className="flex gap-8">
              <FormField
                control={form.control}
                name="temperatures.dry"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      {t.dry}
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="temperatures.chilled"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      {t.chilled}
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="temperatures.frozen"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      {t.frozen}
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Minimum Load */}
          <FormField
            control={form.control}
            name="minimumLoad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.minimumLoad}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder={t.minimumLoadPlaceholder}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Packaging */}
          <div className="space-y-4">
            <FormLabel>{t.packaging}</FormLabel>
            <div className="flex gap-8">
              <FormField
                control={form.control}
                name="palletized"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      {t.palletized}
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nonPalletized"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      {t.nonPalletized}
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Additional Comments */}
          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.additionalComments}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t.commentsPlaceholder}
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
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
