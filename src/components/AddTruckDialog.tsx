import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const CAPACITY_OPTIONS = [
  { value: "3.5", label: "<3.5t" },
  { value: "5", label: "3.5–5t" },
  { value: "8", label: "5–8t" },
  { value: "10", label: "8–10t" },
  { value: "15", label: "10–15t" },
  { value: "20", label: ">15t" },
];

interface AddTruckDialogProps {
  carrierId: string;
  onTruckAdded: () => void;
}

export function AddTruckDialog({ carrierId, onTruckAdded }: AddTruckDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language } = useLanguage();

  const translations = {
    en: {
      addTruck: "Add Truck",
      addNewTruck: "Add New Truck",
      addNewTruckDesc: "Add a new truck to your fleet",
      type: "Type",
      selectTruckType: "Select truck type",
      ambient: "Ambient",
      refrigerated: "Refrigerated",
      frozen: "Frozen",
      capacity: "Capacity (ton)",
      selectCapacity: "Select capacity",
      licensePlate: "License Plate (optional)",
      cancel: "Cancel",
      adding: "Adding...",
      truckAdded: "Truck added successfully",
      addFailed: "Failed to add truck",
      truckTypeRequired: "Truck type is required",
      capacityRequired: "Capacity is required",
    },
    vi: {
      addTruck: "Thêm xe tải",
      addNewTruck: "Thêm xe tải mới",
      addNewTruckDesc: "Thêm xe tải mới vào đội xe của bạn",
      type: "Loại xe",
      selectTruckType: "Chọn loại xe",
      ambient: "Khô (Nhiệt độ thường)",
      refrigerated: "Mát (2–8°C)",
      frozen: "Đông lạnh (–18°C)",
      capacity: "Sức chứa (tấn)",
      selectCapacity: "Chọn sức chứa",
      licensePlate: "Biển số xe (không bắt buộc)",
      cancel: "Hủy",
      adding: "Đang thêm...",
      truckAdded: "Đã thêm xe tải thành công",
      addFailed: "Không thể thêm xe tải",
      truckTypeRequired: "Vui lòng chọn loại xe",
      capacityRequired: "Vui lòng chọn sức chứa",
    },
  };

  const t = translations[language];

  const TRUCK_TYPES = [
    { value: "ambient", label: t.ambient },
    { value: "refrigerated", label: t.refrigerated },
    { value: "frozen", label: t.frozen },
  ];

  const formSchema = z.object({
    truckType: z.string().min(1, t.truckTypeRequired),
    capacity: z.string().min(1, t.capacityRequired),
    licensePlate: z.string().optional(),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      truckType: "",
      capacity: "",
      licensePlate: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("trucks").insert({
        carrier_id: carrierId,
        truck_type: data.truckType,
        load_capacity: parseFloat(data.capacity),
        license_plate: data.licensePlate || "",
      });

      if (error) throw error;

      toast.success(t.truckAdded);
      form.reset();
      setOpen(false);
      onTruckAdded();
    } catch (error: any) {
      console.error("Error adding truck:", error);
      toast.error(t.addFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="w-4 h-4 mr-2" />
          {t.addTruck}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.addNewTruck}</DialogTitle>
          <DialogDescription>
            {t.addNewTruckDesc}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="truckType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.type} *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectTruckType} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRUCK_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.capacity} *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectCapacity} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CAPACITY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="licensePlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.licensePlate}</FormLabel>
                  <FormControl>
                    <Input placeholder="51H-123.45" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t.cancel}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t.adding : t.addTruck}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}