import * as React from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Check, FileText, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type Step4FormData = {
  taxCode: string;
  businessRegistration: any;
  truckRegistration: any;
  verificationComments?: string;
};

interface Step4Props {
  data: Partial<Step4FormData>;
  onSubmit: (data: Step4FormData) => void;
  onBack: () => void;
  language?: "en" | "vi";
}

export const Step4Verification = ({ data, onSubmit, onBack, language = "en" }: Step4Props) => {
  const [businessFiles, setBusinessFiles] = React.useState<File[]>([]);
  const [truckFiles, setTruckFiles] = React.useState<File[]>([]);
  const [skipVerification, setSkipVerification] = React.useState(false);
  const [existingBusinessUrl, setExistingBusinessUrl] = React.useState<string | null>(
    typeof data.businessRegistration === 'string' ? data.businessRegistration : null
  );
  const [existingTruckUrls, setExistingTruckUrls] = React.useState<string[]>(
    Array.isArray(data.truckRegistration) && typeof data.truckRegistration[0] === 'string' 
      ? data.truckRegistration 
      : []
  );

  const translations = {
    en: {
      title: "Verification",
      subtitle: "To verify you as a carrier, we need your Truck Registration Books (Ca Vet) for SENLA to verify your trucks",
      taxCode: "Tax Code (MST)",
      taxCodePlaceholder: "Enter your company tax code",
      businessReg: "Upload Business Registration",
      businessRegDesc: "Upload a clear photo of your Giấy đăng ký kinh doanh (Business Registration).",
      truckReg: "Upload minimum 3 Truck Registration Books (Cà vẹt)",
      truckRegDesc: "For verification, please upload minimum 3 photos of Vehicle Inspection Certificate or Truck Registration Books.",
      uploadText: "Click to upload or drag and drop",
      fileFormat: "PNG, JPG or PDF (max. 10MB)",
      fileFormatMultiple: "PNG, JPG or PDF (max. 10MB each, up to 3 files)",
      comments: "Additional Comments (Optional)",
      commentsPlaceholder: "Add any additional information or notes",
      uploadProgress: "uploaded",
      uploadMore: "Upload more for better verification",
      orUploadVia: "Or upload via",
      zalo: "Zalo",
      sendTo: "Send documents to",
      back: "Back",
      saveLater: "Save, do later",
      submit: "Submit",
      verificationAlmostDone: "Verification Almost Done",
      contactMessage: "Get in touch with us on",
      toComplete: "to complete",
      goToDashboard: "Go to Dashboard",
      errors: {
        taxCodeRequired: "Tax code is required",
        businessRequired: "Business registration is required",
        truckRequired: "At least 3 truck registrations are required",
      }
    },
    vi: {
      title: "Xác minh",
      subtitle: "Để xác minh bạn là nhà vận chuyển, chúng tôi cần Giấy đăng ký xe (Cà vẹt) để SENLA xác minh các phương tiện của bạn",
      taxCode: "Mã số thuế (MST)",
      taxCodePlaceholder: "Nhập mã số thuế công ty",
      businessReg: "Tải lên Giấy đăng ký kinh doanh",
      businessRegDesc: "Tải lên ảnh rõ ràng của Giấy đăng ký kinh doanh.",
      truckReg: "Tải lên giấy đăng ký xe (cà vẹt)",
      truckRegDesc: "Để xác minh, vui lòng tải lên tối thiểu 3 ảnh Giấy đăng kiểm hoặc Cà vẹt của 3 phương tiện khác nhau",
      uploadText: "Nhấp để tải lên hoặc kéo thả",
      fileFormat: "PNG, JPG hoặc PDF (tối đa 10MB)",
      fileFormatMultiple: "PNG, JPG hoặc PDF (tối đa 10MB mỗi file, tối đa 3 files)",
      comments: "Ghi chú thêm (Tùy chọn)",
      commentsPlaceholder: "Thêm thông tin hoặc ghi chú bổ sung",
      uploadProgress: "đã tải lên",
      uploadMore: "Tải thêm để xác minh tốt hơn",
      orUploadVia: "Hoặc tải lên qua",
      zalo: "Zalo",
      sendTo: "Gửi tài liệu đến",
      back: "Quay lại",
      saveLater: "Lưu, làm sau",
      submit: "Gửi",
      verificationAlmostDone: "Xác minh gần hoàn tất",
      contactMessage: "Liên hệ với chúng tôi qua",
      toComplete: "để hoàn tất",
      goToDashboard: "Đến trang chủ",
      errors: {
        taxCodeRequired: "Mã số thuế là bắt buộc",
        businessRequired: "Giấy đăng ký kinh doanh là bắt buộc",
        truckRequired: "Cần ít nhất 3 giấy đăng ký xe",
      }
    }
  };

  const t = translations[language];

  const formSchema = z.object({
    taxCode: z.string().min(1, t.errors.taxCodeRequired),
    businessRegistration: z.any().refine(
      (file) => existingBusinessUrl || file?.length > 0, 
      t.errors.businessRequired
    ),
    truckRegistration: z.any().refine(
      (file) => existingTruckUrls.length >= 3 || file?.length >= 3, 
      t.errors.truckRequired
    ),
    verificationComments: z.string().optional(),
  });

  const form = useForm<Step4FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  });

  // Reset form when data changes (when navigating back to this step)
  React.useEffect(() => {
    form.reset(data);
    if (typeof data.businessRegistration === 'string') {
      setExistingBusinessUrl(data.businessRegistration);
    }
    if (Array.isArray(data.truckRegistration) && typeof data.truckRegistration[0] === 'string') {
      setExistingTruckUrls(data.truckRegistration);
    }
  }, [data]);

  const handleSkipVerification = () => {
    setSkipVerification(true);
  };

  if (skipVerification) {
    return (
      <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {t.verificationAlmostDone}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t.contactMessage}{" "}
            <a 
              href="https://zalo.me/84827892241" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              +84827892241 (Zalo)
            </a>
            {" "}{t.toComplete}
          </p>
          <Button onClick={() => window.location.href = "/"} className="px-8">
            {t.goToDashboard}
          </Button>
        </div>
      </div>
    );
  }

  const getTruckUploadProgress = () => {
    const newFilesCount = truckFiles?.length || 0;
    const existingFilesCount = existingTruckUrls.length;
    const totalCount = truckFiles ? newFilesCount : existingFilesCount;
    return Math.min(totalCount, 3);
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">{t.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t.subtitle}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="taxCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.taxCode}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t.taxCodePlaceholder} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessRegistration"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>{t.businessReg}</FormLabel>
                <FormDescription>
                  {t.businessRegDesc}
                </FormDescription>
                <FormControl>
                  <label
                    htmlFor="businessRegistration"
                    className="block border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/*,.pdf"
                      multiple
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const newFiles = Array.from(e.target.files);
                          const updatedFiles = [...businessFiles, ...newFiles];
                          setBusinessFiles(updatedFiles);
                          onChange(updatedFiles);
                        }
                        // Reset input to allow selecting the same file again
                        e.target.value = '';
                      }}
                      className="hidden"
                      id="businessRegistration"
                    />
                    <span className="text-sm text-muted-foreground hover:text-foreground">
                      {t.uploadText}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.fileFormat}
                    </p>
                  </label>
                </FormControl>
                {businessFiles.length > 0 || existingBusinessUrl ? (
                  <div className="mt-2 space-y-1">
                    {existingBusinessUrl && businessFiles.length === 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Previously uploaded document</span>
                      </div>
                    )}
                    {businessFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="truckRegistration"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <FormLabel>{t.truckReg}</FormLabel>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((num) => (
                      <Badge 
                        key={num}
                        variant={getTruckUploadProgress() >= num ? "default" : "outline"}
                        className="text-xs"
                      >
                        {num}
                      </Badge>
                    ))}
                  </div>
                </div>
                <FormDescription>
                  {t.truckRegDesc}
                </FormDescription>
                <FormControl>
                  <label
                    htmlFor="truckRegistration"
                    className="block border-2 border-dashed border-border rounded-lg p-4 md:p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <Upload className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-muted-foreground" />
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/*,.pdf"
                      multiple
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const newFiles = Array.from(e.target.files);
                          const updatedFiles = [...truckFiles, ...newFiles];
                          setTruckFiles(updatedFiles);
                          onChange(updatedFiles);
                        }
                        // Reset input to allow selecting the same file again
                        e.target.value = '';
                      }}
                      className="hidden"
                      id="truckRegistration"
                    />
                    <span className="text-xs md:text-sm text-muted-foreground hover:text-foreground">
                      {t.uploadText}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.fileFormatMultiple}
                    </p>
                  </label>
                </FormControl>
                {truckFiles.length > 0 || existingTruckUrls.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="font-medium">
                        {getTruckUploadProgress()}/3 {t.uploadProgress}
                      </span>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {existingTruckUrls.length > 0 && truckFiles.length === 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>{existingTruckUrls.length} previously uploaded documents</span>
                        </div>
                      )}
                      {truckFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="truncate">{file.name}</span>
                        </div>
                      ))}
                    </div>
                    {getTruckUploadProgress() >= 3 && (
                      <p className="text-xs text-primary flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {t.uploadMore}
                      </p>
                    )}
                  </div>
                ) : null}
                
                <div className="mt-4 p-3 md:p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-xs md:text-sm text-muted-foreground mb-2">
                    {t.orUploadVia}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href="https://zalo.me/84827892241"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors w-full sm:w-auto"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Zalo
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t.sendTo}: +84 827 892 241
                  </p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="verificationComments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.comments}</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder={t.commentsPlaceholder}
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="w-full sm:w-auto">
              {t.back}
            </Button>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="button" variant="outline" onClick={handleSkipVerification} className="w-full sm:w-auto">
                {t.saveLater}
              </Button>
              <Button type="submit" className="w-full sm:w-auto sm:px-8">
                {t.submit}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
