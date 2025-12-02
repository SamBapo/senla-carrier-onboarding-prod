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
import { Textarea } from "@/components/ui/textarea";
import { PROVINCE_OPTIONS, REGIONS, removeAccents, REGION_TRANSLATIONS } from "@/data/provinces";
import { useState, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type Step1FormData = {
  companyName: string;
  contactPerson: string;
  role: string;
  zaloNumber: string;
  email: string;
  companyAddress: string;
  baseLocation: string;
  numberOfTrucks: number;
};

interface Step1Props {
  data: Partial<Step1FormData>;
  onNext: (data: Step1FormData) => void;
  language?: "en" | "vi";
}

export const Step1CompanyInfo = ({ data, onNext, language = "en" }: Step1Props) => {
  const [open, setOpen] = useState(false);

  const translations = {
    en: {
      title: "Company Information",
      subtitle: "Tell us about your company.",
      companyName: "Company Name",
      contactPerson: "Contact Person",
      role: "Role",
      zaloNumber: "Zalo Number",
      email: "Email",
      companyAddress: "Company Address",
      baseLocation: "Base Location",
      numberOfTrucks: "Number of Trucks",
      continue: "Continue",
      searchProvince: "Search province...",
      selectBaseLocation: "Select base location",
      noProvinceFound: "No province found.",
      enterCompanyName: "Enter company name",
      enterContactPerson: "Enter contact person",
      enterRole: "Enter role",
      enterEmail: "Enter email",
      enterNumberOfTrucks: "Enter number of trucks",
      errors: {
        companyNameRequired: "Company name is required",
        contactPersonRequired: "Contact person is required",
        roleRequired: "Role is required",
        zaloNumberRequired: "Zalo number is required",
        invalidEmail: "Invalid email address",
        baseLocationRequired: "Base location is required",
        minTrucks: "Must have at least 1 truck",
      }
    },
    vi: {
      title: "Thông tin công ty",
      subtitle: "Cho chúng tôi biết về công ty của bạn.",
      companyName: "Tên công ty",
      contactPerson: "Người liên hệ",
      role: "Chức vụ",
      zaloNumber: "Số Zalo",
      email: "Email",
      companyAddress: "Địa chỉ công ty",
      baseLocation: "Địa điểm",
      numberOfTrucks: "Số lượng xe",
      continue: "Tiếp tục",
      searchProvince: "Tìm kiếm tỉnh thành...",
      selectBaseLocation: "Chọn địa điểm",
      noProvinceFound: "Không tìm thấy tỉnh thành.",
      enterCompanyName: "Nhập tên công ty",
      enterContactPerson: "Nhập tên người liên hệ",
      enterRole: "Nhập chức vụ",
      enterEmail: "Nhập email",
      enterNumberOfTrucks: "Nhập số lượng xe",
      errors: {
        companyNameRequired: "Tên công ty là bắt buộc",
        contactPersonRequired: "Người liên hệ là bắt buộc",
        roleRequired: "Chức vụ là bắt buộc",
        zaloNumberRequired: "Số Zalo là bắt buộc",
        invalidEmail: "Địa chỉ email không hợp lệ",
        baseLocationRequired: "Địa điểm là bắt buộc",
        minTrucks: "Phải có ít nhất 1 xe",
      }
    }
  };

  const t = translations[language];

  const formSchema = z.object({
    companyName: z.string().min(1, t.errors.companyNameRequired),
    contactPerson: z.string().min(1, t.errors.contactPersonRequired),
    role: z.string().min(1, t.errors.roleRequired),
    zaloNumber: z.string().min(1, t.errors.zaloNumberRequired),
    email: z.string().email(t.errors.invalidEmail),
    companyAddress: z.string().min(1, language === "en" ? "Company address is required" : "Địa chỉ công ty là bắt buộc"),
    baseLocation: z.string().min(1, t.errors.baseLocationRequired),
    numberOfTrucks: z.coerce.number().min(1, t.errors.minTrucks),
  });
  
  const form = useForm<Step1FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: data.companyName || "",
      contactPerson: data.contactPerson || "",
      role: data.role || "",
      zaloNumber: data.zaloNumber || "",
      email: data.email || "",
      companyAddress: data.companyAddress || "",
      baseLocation: data.baseLocation || "",
      numberOfTrucks: data.numberOfTrucks,
    },
  });

  // Reset form when data changes (when navigating back to this step)
  useEffect(() => {
    form.reset({
      companyName: data.companyName || "",
      contactPerson: data.contactPerson || "",
      role: data.role || "",
      zaloNumber: data.zaloNumber || "",
      email: data.email || "",
      companyAddress: data.companyAddress || "",
      baseLocation: data.baseLocation || "",
      numberOfTrucks: data.numberOfTrucks,
    });
  }, [data]);

  // Group provinces by region
  const groupedProvinces = REGIONS.map(region => ({
    region,
    options: PROVINCE_OPTIONS.filter(p => p.region === region).sort((a, b) => a.label.localeCompare(b.label))
  }));

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
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.companyName} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t.enterCompanyName} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.contactPerson} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t.enterContactPerson} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.role} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t.enterRole} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zaloNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.zaloNumber} *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={field.value ? "" : "+84..."}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === "en" ? "Company Email" : "Email công ty"} *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t.enterEmail} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="companyAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.companyAddress} *</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder={language === "en" ? "Enter full company address" : "Nhập địa chỉ đầy đủ công ty"} 
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-6 items-end">
            <FormField
              control={form.control}
              name="baseLocation"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t.baseLocation} *</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            "justify-between font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? PROVINCE_OPTIONS.find((p) => p.value === field.value)?.label
                            : t.selectBaseLocation}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command
                        filter={(value, search) => {
                          const option = PROVINCE_OPTIONS.find(p => p.value === value);
                          if (!option) return 0;
                          
                          const searchNormalized = removeAccents(search);
                          const labelNormalized = removeAccents(option.label);
                          const provincesNormalized = option.provinces.map(p => removeAccents(p)).join(" ");
                          
                          if (labelNormalized.includes(searchNormalized) || 
                              provincesNormalized.includes(searchNormalized)) {
                            return 1;
                          }
                          return 0;
                        }}
                      >
                        <CommandInput placeholder={t.searchProvince} />
                        <CommandList>
                          <CommandEmpty>{t.noProvinceFound}</CommandEmpty>
                          {groupedProvinces.map(({ region, options }) => (
                            <CommandGroup key={region} heading={<span className="font-bold">{REGION_TRANSLATIONS[language][region]}</span>}>
                              {options.map((option) => (
                                <CommandItem
                                  key={option.value}
                                  value={option.value}
                                  onSelect={() => {
                                    form.setValue("baseLocation", option.value);
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div>
                                    <div>{option.label}</div>
                                    {option.provinces.length > 1 && (
                                      <div className="text-xs text-muted-foreground">
                                        {option.provinces.join(", ")}
                                      </div>
                                    )}
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfTrucks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.numberOfTrucks} *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder={t.enterNumberOfTrucks}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              {t.continue}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
