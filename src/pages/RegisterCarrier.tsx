import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegistrationStepper } from "@/components/carrier-registration/RegistrationStepper";
import { Step1CompanyInfo, Step1FormData } from "@/components/carrier-registration/Step1CompanyInfo";
import { Step2TruckInfo, Step2FormData } from "@/components/carrier-registration/Step2TruckInfo";
import { Step3LoadPreferences, Step3FormData } from "@/components/carrier-registration/Step3LoadPreferences";
import { Step4Verification, Step4FormData } from "@/components/carrier-registration/Step4Verification";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { PROVINCE_OPTIONS } from "@/data/provinces";
import { useLanguage } from "@/contexts/LanguageContext";

type FormData = Partial<Step1FormData> &
  Partial<Step2FormData> &
  Partial<Step3FormData> &
  Partial<Step4FormData>;

const RegisterCarrier = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [fieldProgress, setFieldProgress] = useState(0);
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carrierId, setCarrierId] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please sign in to register as a carrier");
      navigate("/auth");
      return;
    }

    // Load existing carrier data if any
    const { data: existingCarrier } = await supabase
      .from("carriers")
      .select("*, trucks(*)")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (existingCarrier) {
      setCarrierId(existingCarrier.id);
      
      // Process trucks data to populate form
      const trucksData = existingCarrier.trucks || [];
      const truckTypeSet = new Set<string>();
      const capacitiesMap: Record<string, Record<string, number>> = {};
      
      trucksData.forEach((truck: any) => {
        truckTypeSet.add(truck.truck_type);
        
        if (!capacitiesMap[truck.truck_type]) {
          capacitiesMap[truck.truck_type] = {};
        }
        
        const capacityKey = `${truck.load_capacity}t`;
        capacitiesMap[truck.truck_type][capacityKey] = 
          (capacitiesMap[truck.truck_type][capacityKey] || 0) + 1;
      });
      
      // Parse load preferences
      const preferredLoadTypes = existingCarrier.preferred_load_types || [];
      const additionalServices = existingCarrier.additional_services || [];
      
      // Parse Step 3 data from database
      const ftl = preferredLoadTypes.includes("FTL");
      const ltl = preferredLoadTypes.includes("LTL");
      const temperaturesDry = additionalServices.includes("Dry");
      const temperaturesChilled = additionalServices.includes("Chilled");
      const temperaturesFrozen = additionalServices.includes("Frozen");
      const palletized = additionalServices.includes("Palletized");
      const nonPalletized = additionalServices.includes("Non-Palletized");
      
      // Populate form with existing data
      const loadedData: FormData = {
        companyName: existingCarrier.company_name,
        contactPerson: existingCarrier.contact_person,
        role: existingCarrier.contact_role,
        zaloNumber: existingCarrier.zalo_number,
        email: existingCarrier.email,
        companyAddress: existingCarrier.company_address,
        baseLocation: existingCarrier.base_location,
        numberOfTrucks: existingCarrier.number_of_trucks,
        taxCode: existingCarrier.tax_code || "",
        comments: existingCarrier.comments || "",
        coverage: existingCarrier.preferred_routes || [],
        truckTypes: Array.from(truckTypeSet),
        capacities: capacitiesMap,
        ftl,
        ltl,
        temperatures: {
          dry: temperaturesDry,
          chilled: temperaturesChilled,
          frozen: temperaturesFrozen,
        },
        palletized,
        nonPalletized,
        businessRegistration: existingCarrier.business_registration_url,
        truckRegistration: existingCarrier.truck_registration_urls,
      };
      setFormData(loadedData);
      
      // If carrier has submitted (pending or approved), show completion screen first
      if (existingCarrier.status === "pending" || existingCarrier.status === "approved") {
        setIsCompleted(true);
        setCurrentStep(0); // 0 shows completion screen, 1-4 shows steps for review/edit
      } else if (existingCarrier.status === "draft") {
        // Determine which step to start from based on completed data
        let nextStep = 1;
        
        // Check if step 1 is complete
        if (existingCarrier.company_name && existingCarrier.base_location && existingCarrier.number_of_trucks) {
          nextStep = 2;
        }
        
        // Check if step 2 is complete
        if (nextStep === 2 && trucksData.length > 0 && existingCarrier.preferred_routes?.length > 0) {
          nextStep = 3;
        }
        
        // Check if step 3 is complete
        if (nextStep === 3 && (existingCarrier.preferred_load_types?.length > 0 || existingCarrier.additional_services?.length > 0)) {
          nextStep = 4;
        }
        
        setCurrentStep(nextStep);
      }
    }
  };

  const translations = {
    en: {
      title: "Carrier Registration",
      subtitle: "Complete your registration in 4 easy steps",
      progress: "Progress",
      step1: "Company Information",
      step2: "Truck Information",
      step3: "Load Preferences",
      step4: "Verification",
      completed: "Onboarding Completed!",
      completedMessage: "Thank you for submitting - your verification is under review. Ship with SENLA soon!",
      dataSubmitted: "Data Submitted - Pending Review",
      dataSubmittedMessage: "You successfully onboarded - your onboarding is under review by our team.",
      goToDashboard: "Go to Dashboard",
      saved: "Saved"
    },
    vi: {
      title: "Đăng ký nhà vận chuyển",
      subtitle: "Hoàn thành đăng ký trong 4 bước đơn giản",
      progress: "Tiến độ",
      step1: "Thông tin công ty",
      step2: "Thông tin xe tải",
      step3: "Ưu tiên chuyến hàng",
      step4: "Xác minh",
      completed: "Đăng ký hoàn tất!",
      completedMessage: "Cảm ơn bạn đã đăng ký - hồ sơ của bạn đang được xem xét. Bắt đầu vận chuyển với SENLA sớm!",
      dataSubmitted: "Dữ liệu đã gửi - Đang chờ xét duyệt",
      dataSubmittedMessage: "Bạn đã đăng ký thành công - hồ sơ của bạn đang được xem xét bởi đội ngũ của chúng tôi.",
      goToDashboard: "Đến trang chủ",
      saved: "Đã lưu"
    }
  };

  const t = translations[language];
  const [isCompleted, setIsCompleted] = useState(false);
  
  // When isCompleted is true, currentStep 0 shows the completion message
  // currentStep 1-4 shows the actual steps for review/editing
  useEffect(() => {
    if (isCompleted && currentStep > 0) {
      // User is reviewing, they can navigate steps but step 2 should show trucks as readonly
    }
  }, [isCompleted, currentStep]);

  // Helper function to get province display name
  const getProvinceLabel = (value: string) => {
    const province = PROVINCE_OPTIONS.find(p => p.value === value);
    return province ? province.label : value;
  };

  // Calculate field completion for current step
  useEffect(() => {
    let filledFields = 0;
    let totalFields = 0;

    switch (currentStep) {
      case 1:
        totalFields = 7;
        if (formData.companyName) filledFields++;
        if (formData.contactPerson) filledFields++;
        if (formData.role) filledFields++;
        if (formData.zaloNumber) filledFields++;
        if (formData.email) filledFields++;
        if (formData.baseLocation) filledFields++;
        if (formData.numberOfTrucks) filledFields++;
        break;
      case 2:
        totalFields = 3;
        if (formData.truckTypes && formData.truckTypes.length > 0) filledFields++;
        if (formData.capacities && Object.keys(formData.capacities).length > 0) filledFields++;
        if (formData.coverage && formData.coverage.length > 0) filledFields++;
        break;
      case 3:
        totalFields = 4;
        if ((formData as any).ftl || (formData as any).ltl) filledFields++;
        if ((formData as any).temperatures && ((formData as any).temperatures.dry || (formData as any).temperatures.chilled || (formData as any).temperatures.frozen)) filledFields++;
        if ((formData as any).minimumLoad !== undefined) filledFields++;
        if ((formData as any).palletized || (formData as any).nonPalletized) filledFields++;
        break;
      case 4:
        totalFields = 2;
        if ((formData as any).businessRegistration) filledFields++;
        if ((formData as any).truckRegistration) filledFields++;
        break;
    }

    const stepBaseProgress = ((currentStep - 1) / 4) * 100;
    const stepFieldProgress = (filledFields / totalFields) * (100 / 4);
    setFieldProgress(stepBaseProgress + stepFieldProgress);
  }, [currentStep, formData]);

  const handleStep1Next = async (data: Step1FormData) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const carrierData = {
        user_id: user.id,
        company_name: data.companyName || "",
        contact_person: data.contactPerson || "",
        contact_role: data.role || "",
        zalo_number: data.zaloNumber || "",
        email: data.email || "",
        company_address: data.companyAddress || "",
        base_location: data.baseLocation || "",
        number_of_trucks: data.numberOfTrucks || 0,
        status: "draft"
      };

      if (carrierId) {
        // Update existing carrier
        const { error } = await supabase
          .from("carriers")
          .update(carrierData)
          .eq("id", carrierId);
        if (error) throw error;
      } else {
        // Create new carrier
        const { data: newCarrier, error } = await supabase
          .from("carriers")
          .insert(carrierData)
          .select()
          .single();
        if (error) throw error;
        setCarrierId(newCarrier.id);
      }

      setCurrentStep(2);
      toast.success(t.saved, {
        description: language === "en" ? "You've successfully saved your company information." : "Bạn đã lưu thông tin công ty thành công.",
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        style: { fontSize: '1.2em' },
      });
    } catch (error: any) {
      console.error("Error saving step 1:", error);
      toast.error(error.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep2Next = async (data: Step2FormData) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    setIsSubmitting(true);

    // Helper function to parse capacity range to numeric value
    const parseCapacity = (capacityStr: string): number => {
      const trimmed = capacityStr.trim();
      
      // Direct mapping for exact capacity ranges (handles both hyphen and en-dash)
      const capacityMap: Record<string, number> = {
        '<3.5t': 3.5,
        '3.5-5t': 5,
        '3.5–5t': 5,  // en-dash version
        '5-8t': 8,
        '5–8t': 8,    // en-dash version
        '8-10t': 10,
        '8–10t': 10,  // en-dash version
        '10-15t': 15,
        '10–15t': 15, // en-dash version
        '>15t': 16    // Use 16 for >15t to distinguish from exactly 15
      };
      
      if (capacityMap[trimmed]) {
        return capacityMap[trimmed];
      }
      
      // Fallback parsing logic
      const cleaned = capacityStr.replace(/t/gi, '').trim();
      
      // Handle ranges with hyphen or en-dash
      if (cleaned.includes('-') || cleaned.includes('–')) {
        const parts = cleaned.split(/[-–]/);
        return parseFloat(parts[1]) || 0;
      }
      
      // Handle "<3.5" -> take the value
      if (cleaned.startsWith('<')) {
        return parseFloat(cleaned.substring(1)) || 0;
      }
      
      // Handle ">15" -> take the value (use 16 to distinguish)
      if (cleaned.startsWith('>')) {
        return 16;
      }
      
      // Default: try to parse as float
      return parseFloat(cleaned) || 0;
    };

    try {
      if (!carrierId) throw new Error("No carrier profile found");

      // Update carrier with truck info
      const { error: updateError } = await supabase
        .from("carriers")
        .update({
          preferred_routes: data.coverage || []
        })
        .eq("id", carrierId);

      if (updateError) throw updateError;

      // Get existing trucks to preserve license plates
      const { data: existingTrucks } = await supabase
        .from("trucks")
        .select("*")
        .eq("carrier_id", carrierId);

      // Calculate new trucks needed
      const newTrucksToInsert = [];
      const existingTruckMap = new Map();

      // Map existing trucks by type and capacity
      if (existingTrucks) {
        existingTrucks.forEach(truck => {
          const key = `${truck.truck_type}_${truck.load_capacity}`;
          if (!existingTruckMap.has(key)) {
            existingTruckMap.set(key, []);
          }
          existingTruckMap.get(key).push(truck);
        });
      }

      console.log("🚛 === STEP 2 TRUCK REGISTRATION DEBUG ===");
      console.log("🚛 truckTypes:", data.truckTypes);
      console.log("🚛 capacities raw:", data.capacities);
      console.log("🚛 capacities stringified:", JSON.stringify(data.capacities, null, 2));

      if (data.truckTypes && Array.isArray(data.truckTypes) && data.truckTypes.length > 0) {
        for (const truckType of data.truckTypes) {
          const capacityData = (data.capacities || {})[truckType];
          console.log(`🚛 Processing ${truckType}:`);
          console.log(`🚛   capacityData:`, capacityData);
          console.log(`🚛   capacityData keys:`, capacityData ? Object.keys(capacityData) : 'none');
          
          if (capacityData && typeof capacityData === 'object') {
            for (const [capacity, quantity] of Object.entries(capacityData)) {
              const numTrucks = typeof quantity === 'number' ? quantity : parseInt(quantity as string) || 0;
              console.log(`🚛     capacity key: "${capacity}" => quantity: ${quantity} => numTrucks: ${numTrucks}`);
              
              // Skip if numTrucks is 0 or empty
              if (numTrucks === 0) {
                console.log(`🚛     ⏭️  Skipping ${capacity} (no trucks)`);
                continue;
              }
              
              // Convert underscore back to dot for parsing (e.g., "<3_5t" -> "<3.5t")
              const normalizedCapacity = capacity.replace('_', '.');
              const parsedCapacity = parseCapacity(normalizedCapacity);
              console.log(`🚛     ✅ normalized: ${normalizedCapacity}, parsedCapacity: ${parsedCapacity}`);
              
              const key = `${truckType}_${parsedCapacity}`;
              const existingForType = existingTruckMap.get(key) || [];
              
              console.log(`🚛     📊 ${truckType} ${capacity}: need ${numTrucks}, have ${existingForType.length}`);
              
              // If we need more trucks than we have, add new ones
              const trucksToAdd = Math.max(0, numTrucks - existingForType.length);
              console.log(`🚛     ➕ Adding ${trucksToAdd} new trucks for ${key}`);
              
              for (let i = 0; i < trucksToAdd; i++) {
                newTrucksToInsert.push({
                  carrier_id: carrierId,
                  truck_type: truckType,
                  load_capacity: parsedCapacity,
                  license_plate: ""
                });
              }
              
              // If we have more trucks than needed, mark extras for deletion
              if (existingForType.length > numTrucks) {
                const trucksToDelete = existingForType.slice(numTrucks);
                console.log(`Deleting ${trucksToDelete.length} excess trucks for ${key}`);
                for (const truck of trucksToDelete) {
                  await supabase.from("trucks").delete().eq("id", truck.id);
                }
              }
            }
          }
        }

        console.log(`🚛 === SUMMARY ===`);
        console.log(`🚛 Total new trucks to insert: ${newTrucksToInsert.length}`);
        console.log("🚛 New trucks:", JSON.stringify(newTrucksToInsert, null, 2));

        // Insert only new trucks
        if (newTrucksToInsert.length > 0) {
          const { error: trucksError } = await supabase
            .from("trucks")
            .insert(newTrucksToInsert);
          if (trucksError) {
            console.error("🚛 ❌ Error inserting trucks:", trucksError);
            throw trucksError;
          }
          console.log(`🚛 ✅ Successfully inserted ${newTrucksToInsert.length} trucks!`);
        } else {
          console.log(`🚛 ℹ️  No new trucks to insert`);
        }
      }

      setCurrentStep(3);
      toast.success(t.saved, {
        description: language === "en" ? "You've successfully added your trucks." : "Bạn đã thêm thông tin xe tải thành công.",
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        style: { fontSize: '1.2em' },
      });
    } catch (error: any) {
      console.error("Error saving step 2:", error);
      toast.error(error.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep3Next = async (data: Step3FormData) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    setIsSubmitting(true);

    try {
      if (!carrierId) throw new Error("No carrier profile found");

      // Prepare preferred load types
      const preferredLoadTypes = [];
      if ((data as any).ftl) preferredLoadTypes.push("FTL");
      if ((data as any).ltl) preferredLoadTypes.push("LTL");
      
      // Prepare temperature preferences
      const temperaturePrefs = [];
      if ((data as any).temperatures?.dry) temperaturePrefs.push("Dry");
      if ((data as any).temperatures?.chilled) temperaturePrefs.push("Chilled");
      if ((data as any).temperatures?.frozen) temperaturePrefs.push("Frozen");
      
      // Prepare additional services
      const additionalServices = [];
      if ((data as any).palletized) additionalServices.push("Palletized");
      if ((data as any).nonPalletized) additionalServices.push("Non-Palletized");

      const { error } = await supabase
        .from("carriers")
        .update({
          preferred_load_types: preferredLoadTypes.length > 0 ? preferredLoadTypes : null,
          additional_services: [...temperaturePrefs, ...additionalServices],
          comments: data.comments || null
        })
        .eq("id", carrierId);

      if (error) throw error;

      setCurrentStep(4);
      toast.success(t.saved, {
        description: language === "en" ? "You've successfully added your load preferences." : "Bạn đã lưu ưu tiên chuyến hàng thành công.",
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        style: { fontSize: '1.2em' },
      });
    } catch (error: any) {
      console.error("Error saving step 3:", error);
      toast.error(error.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadFile = async (
    file: File, 
    folder: string
  ): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('carrier-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      return fileName;
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(`Failed to upload ${file.name}`);
      return null;
    }
  };

  const handleStep4Submit = async (data: Step4FormData) => {
    const finalData = { ...formData, ...data };
    setFormData(finalData);
    setIsSubmitting(true);

    try {
      if (!carrierId) throw new Error("No carrier profile found");

      // Upload business registration
      let businessRegUrl: string | null = null;
      if (data.businessRegistration && data.businessRegistration.length > 0) {
        const file = data.businessRegistration[0];
        toast.loading(`Uploading ${file.name}...`, { id: 'business-upload' });
        businessRegUrl = await uploadFile(file, 'business-registration');
        
        if (businessRegUrl) {
          toast.success(`${file.name} uploaded successfully`, { id: 'business-upload' });
        } else {
          toast.dismiss('business-upload');
        }
      }

      // Upload truck registrations
      const truckRegUrls: string[] = [];
      if (data.truckRegistration && data.truckRegistration.length > 0) {
        const files = data.truckRegistration instanceof FileList 
          ? Array.from(data.truckRegistration) 
          : Array.isArray(data.truckRegistration) 
          ? data.truckRegistration 
          : [data.truckRegistration];
        
        toast.loading(`Uploading ${files.length} truck registration files...`, { id: 'truck-upload' });
        
        for (const file of files) {
          if (file instanceof File) {
            const url = await uploadFile(file, 'truck-registration');
            if (url) truckRegUrls.push(url);
          }
        }
        
        if (truckRegUrls.length > 0) {
          toast.success(`Successfully uploaded ${truckRegUrls.length} truck registration files`, { id: 'truck-upload' });
        } else {
          toast.dismiss('truck-upload');
        }
      }

      // Update carrier with final data
      const { error: updateError } = await supabase
        .from("carriers")
        .update({
          tax_code: data.taxCode,
          business_registration_url: businessRegUrl,
          truck_registration_urls: truckRegUrls,
          status: "pending"
        })
        .eq("id", carrierId);

      if (updateError) throw updateError;

      toast.success(
        language === "en" 
          ? "You successfully onboarded - your onboarding is under review by our team." 
          : "Bạn đã đăng ký thành công - hồ sơ của bạn đang được xem xét bởi đội ngũ của chúng tôi."
      );
      setIsCompleted(true);
      setCurrentStep(0); // Navigate to completion screen
    } catch (error: any) {
      console.error("Error submitting registration:", error);
      toast.error(error.message || "Failed to submit registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  if (isCompleted && currentStep === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="bg-card rounded-lg border shadow-sm p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {t.dataSubmitted}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t.dataSubmittedMessage}
            </p>
          </div>

          {/* Summary of Submitted Data */}
          <div className="space-y-6 text-left">
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">
                {language === "en" ? "Registration Summary" : "Tóm tắt đăng ký"}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Company Name" : "Tên công ty"}
                  </p>
                  <p className="font-medium">{formData.companyName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Contact Person" : "Người liên hệ"}
                  </p>
                  <p className="font-medium">{formData.contactPerson} ({formData.role})</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Base Location" : "Địa điểm"}
                  </p>
                  <p className="font-medium">{getProvinceLabel(formData.baseLocation || "")}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Number of Trucks" : "Số xe"}
                  </p>
                  <p className="font-medium">{formData.numberOfTrucks}</p>
                </div>
                
                {formData.coverage && formData.coverage.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? "Coverage Areas" : "Khu vực phủ sóng"}
                    </p>
                    <p className="font-medium">{formData.coverage.length} {language === "en" ? "provinces" : "tỉnh"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 items-center">
            <Button onClick={() => setCurrentStep(1)} variant="outline" size="lg" className="w-full max-w-xs">
              {language === "en" ? "Review & Edit Registration" : "Xem lại & Chỉnh sửa đăng ký"}
            </Button>
            <Button onClick={() => navigate("/my-profile")} className="px-8">
              {language === "en" ? "View My Profile" : "Xem hồ sơ của tôi"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          {isCompleted && (
            <div className="mb-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(0)}
                className="mb-2"
              >
                ← {language === "en" ? "Back to Summary" : "Quay lại trang tóm tắt"}
              </Button>
              <p className="text-sm text-amber-600">
                {language === "en" 
                  ? "You are in review mode. Changes to truck data (Step 2) are disabled. Edit other information as needed."
                  : "Bạn đang ở chế độ xem lại. Thay đổi dữ liệu xe (Bước 2) bị vô hiệu hóa. Chỉnh sửa thông tin khác nếu cần."}
              </p>
            </div>
          )}
          <Progress value={fieldProgress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {currentStep} of 4
          </p>
        </div>

        {/* Main Content */}
        <div className="flex gap-12">
          {/* Left: Stepper */}
          <div className="w-64 flex-shrink-0">
            <RegistrationStepper 
              currentStep={currentStep} 
              onStepClick={handleStepClick}
              language={language}
              translations={{
                step1: t.step1,
                step2: t.step2,
                step3: t.step3,
                step4: t.step4,
              }}
            />
          </div>

          {/* Right: Form */}
          <div className="flex-1">
            {currentStep === 1 && (
              <Step1CompanyInfo data={formData} onNext={handleStep1Next} language={language} />
            )}
            {currentStep === 2 && (
              <Step2TruckInfo
                data={formData}
                onNext={handleStep2Next}
                onBack={handleBack}
                language={language}
              />
            )}
            {currentStep === 3 && (
              <Step3LoadPreferences
                data={formData}
                onNext={handleStep3Next}
                onBack={handleBack}
                language={language}
              />
            )}
            {currentStep === 4 && (
              <Step4Verification
                data={formData}
                onSubmit={handleStep4Submit}
                onBack={handleBack}
                language={language}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCarrier;
