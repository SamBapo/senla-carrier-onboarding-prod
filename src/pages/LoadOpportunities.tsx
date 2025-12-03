import { useState, useEffect } from 'react';
import { LoadCard } from '@/components/LoadCard';
import { mockLoads } from '@/data/mockLoads';
import { Load } from '@/types/load';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatVND } from '@/utils/currency';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const removeAccents = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

const translations = {
  en: {
    title: "Load Opportunities for You",
    subtitle: "Browse available loads and accept the ones that fit your fleet",
    onboardingAlert: "Complete your carrier onboarding to see full load details. Visit",
    carrierOnboarding: "Carrier Onboarding",
    toGetStarted: "to get started.",
    origin: "Origin",
    originPlaceholder: "E.g., Hà Nội",
    destination: "Destination",
    destinationPlaceholder: "E.g., Hồ Chí Minh",
    pickupDate: "Pickup Date",
    dropoffDate: "Dropoff Date",
    temperatureType: "Temperature Type",
    selectTemperature: "Select temperature",
    ambient: "Ambient",
    chilled: "Chilled (0–4°C)",
    frozen: "Frozen (-18°C)",
    maxWeight: "Max Weight",
    noLoads: "No loads match your filters. Try adjusting your search criteria.",
    loading: "Loading...",
    loadDetails: "Load Details",
    loadDetailsDesc: "Complete information about this load opportunity",
    pickupDeadline: "Pickup Deadline",
    dropoffDeadline: "Dropoff Deadline",
    weight: "Weight",
    pallets: "Pallets",
    temperature: "Temperature",
    detourDistance: "Detour Distance",
    priceEstimate: "Price Estimate",
    close: "Close",
    acceptLoad: "Accept Load",
    confirmAcceptTitle: "Confirm Load Acceptance",
    confirmAcceptDesc: "Are you sure you want to accept this load?",
    pickup: "Pickup",
    cancel: "Cancel",
    confirmAccept: "Confirm Accept",
    errorLogin: "You must be logged in to accept loads",
    errorAccept: "Failed to accept load. Please try again.",
    loadAccepted: "Load Accepted",
    loadAcceptedDesc: "You have successfully accepted the load from",
    to: "to",
  },
  vi: {
    title: "Cơ Hội Vận Chuyển Dành Cho Bạn",
    subtitle: "Duyệt các chuyến hàng có sẵn và chọn chuyến phù hợp với đội xe của bạn",
    onboardingAlert: "Hoàn tất đăng ký nhà vận chuyển để xem chi tiết chuyến hàng. Truy cập",
    carrierOnboarding: "Đăng Ký Nhà Vận Chuyển",
    toGetStarted: "để bắt đầu.",
    origin: "Điểm đi",
    originPlaceholder: "VD: Hà Nội",
    destination: "Điểm đến",
    destinationPlaceholder: "VD: Hồ Chí Minh",
    pickupDate: "Ngày lấy hàng",
    dropoffDate: "Ngày giao hàng",
    temperatureType: "Loại nhiệt độ",
    selectTemperature: "Chọn nhiệt độ",
    ambient: "Nhiệt độ thường",
    chilled: "Lạnh (0–4°C)",
    frozen: "Đông lạnh (-18°C)",
    maxWeight: "Trọng lượng tối đa",
    noLoads: "Không có chuyến hàng nào phù hợp với bộ lọc. Hãy thử điều chỉnh tiêu chí tìm kiếm.",
    loading: "Đang tải...",
    loadDetails: "Chi Tiết Chuyến Hàng",
    loadDetailsDesc: "Thông tin đầy đủ về cơ hội vận chuyển này",
    pickupDeadline: "Hạn lấy hàng",
    dropoffDeadline: "Hạn giao hàng",
    weight: "Trọng lượng",
    pallets: "Số pallet",
    temperature: "Nhiệt độ",
    detourDistance: "Khoảng cách đi vòng",
    priceEstimate: "Giá ước tính",
    close: "Đóng",
    acceptLoad: "Nhận Chuyến",
    confirmAcceptTitle: "Xác Nhận Nhận Chuyến",
    confirmAcceptDesc: "Bạn có chắc chắn muốn nhận chuyến hàng này?",
    pickup: "Lấy hàng",
    cancel: "Hủy",
    confirmAccept: "Xác Nhận",
    errorLogin: "Bạn phải đăng nhập để nhận chuyến hàng",
    errorAccept: "Không thể nhận chuyến hàng. Vui lòng thử lại.",
    loadAccepted: "Đã Nhận Chuyến",
    loadAcceptedDesc: "Bạn đã nhận thành công chuyến hàng từ",
    to: "đến",
  }
};

const LoadOpportunities = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [loads, setLoads] = useState<Load[]>(mockLoads);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [carrierId, setCarrierId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    pickupDate: '',
    dropoffDate: '',
    temperature: '',
    maxWeight: 15000
  });

  useEffect(() => {
    const checkCarrierStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsLoading(false);
        return;
      }

      const { data: carrier } = await supabase
        .from("carriers")
        .select("id, status")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (carrier) {
        setCarrierId(carrier.id);
        setIsApproved(carrier.status === "pending" || carrier.status === "approved");
      }
      
      setIsLoading(false);
    };

    checkCarrierStatus();
  }, []);

  const handleViewDetails = (load: Load) => {
    setSelectedLoad(load);
    setDetailsModalOpen(true);
  };

  const handleAcceptClick = (load: Load) => {
    setSelectedLoad(load);
    setAcceptModalOpen(true);
  };

  const handleConfirmAccept = async () => {
    if (selectedLoad && carrierId) {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Error",
          description: t.errorLogin,
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase.from("orders").insert({
        carrier_id: carrierId,
        user_id: session.user.id,
        load_id: selectedLoad.id,
        origin: selectedLoad.origin,
        destination: selectedLoad.destination,
        pickup_deadline: selectedLoad.pickupDeadline,
        dropoff_deadline: selectedLoad.dropoffDeadline,
        weight: selectedLoad.weight,
        pallets: selectedLoad.pallets,
        temperature: selectedLoad.temperature,
        detour_distance: selectedLoad.detourDistance,
        price_estimate: selectedLoad.priceEstimate
      });

      if (error) {
        toast({
          title: "Error",
          description: t.errorAccept,
          variant: "destructive"
        });
        return;
      }

      setLoads(loads.filter(l => l.id !== selectedLoad.id));
      toast({
        title: t.loadAccepted,
        description: `${t.loadAcceptedDesc} ${selectedLoad.origin} ${t.to} ${selectedLoad.destination}`,
      });
      setAcceptModalOpen(false);
      setSelectedLoad(null);
    }
  };

  const filteredLoads = loads.filter(load => {
    if (filters.origin && !removeAccents(load.origin).includes(removeAccents(filters.origin))) return false;
    if (filters.destination && !removeAccents(load.destination).includes(removeAccents(filters.destination))) return false;
    if (filters.temperature && load.temperature !== filters.temperature) return false;
    if (load.weight > filters.maxWeight) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        {!isApproved && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {t.onboardingAlert}{" "}
              <a href="/register-carrier" className="font-semibold underline">
                {t.carrierOnboarding}
              </a>{" "}
              {t.toGetStarted}
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            <div className="space-y-2">
              <Label htmlFor="origin" className="text-sm font-medium text-foreground">{t.origin}</Label>
              <Input
                id="origin"
                placeholder={t.originPlaceholder}
                value={filters.origin}
                onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination" className="text-sm font-medium text-foreground">{t.destination}</Label>
              <Input
                id="destination"
                placeholder={t.destinationPlaceholder}
                value={filters.destination}
                onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupDate" className="text-sm font-medium text-foreground">{t.pickupDate}</Label>
              <Input
                id="pickupDate"
                type="date"
                value={filters.pickupDate}
                onChange={(e) => setFilters({ ...filters, pickupDate: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dropoffDate" className="text-sm font-medium text-foreground">{t.dropoffDate}</Label>
              <Input
                id="dropoffDate"
                type="date"
                value={filters.dropoffDate}
                onChange={(e) => setFilters({ ...filters, dropoffDate: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature" className="text-sm font-medium text-foreground">{t.temperatureType}</Label>
              <Select value={filters.temperature} onValueChange={(value) => setFilters({ ...filters, temperature: value })}>
                <SelectTrigger id="temperature" className="h-11">
                  <SelectValue placeholder={t.selectTemperature} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ambient">{t.ambient}</SelectItem>
                  <SelectItem value="Chilled (0-4°C)">{t.chilled}</SelectItem>
                  <SelectItem value="Frozen (-18°C)">{t.frozen}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxWeight" className="text-sm font-medium text-foreground">{t.maxWeight}: {filters.maxWeight.toLocaleString()} kg</Label>
              <Slider
                id="maxWeight"
                min={0}
                max={15000}
                step={500}
                value={[filters.maxWeight]}
                onValueChange={(value) => setFilters({ ...filters, maxWeight: value[0] })}
                className="mt-4"
              />
            </div>
          </div>
        </div>

        <div className={`space-y-5 ${!isApproved ? 'relative' : ''}`}>
          {!isApproved && (
            <div className="absolute inset-0 backdrop-blur-sm z-10 pointer-events-none" />
          )}
          {filteredLoads.length > 0 ? (
            filteredLoads.map((load) => (
              <div key={load.id} className={!isApproved ? 'blur-[2px]' : ''}>
                <LoadCard
                  load={load}
                  onViewDetails={isApproved ? handleViewDetails : () => {}}
                  onAccept={isApproved ? handleAcceptClick : () => {}}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {t.noLoads}
            </div>
          )}
        </div>
      </div>

      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.loadDetails}</DialogTitle>
            <DialogDescription>{t.loadDetailsDesc}</DialogDescription>
          </DialogHeader>
          {selectedLoad && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t.origin}</p>
                  <p className="font-semibold">{selectedLoad.origin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.destination}</p>
                  <p className="font-semibold">{selectedLoad.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.pickupDeadline}</p>
                  <p className="font-semibold">{format(new Date(selectedLoad.pickupDeadline), 'dd MMM yyyy – HH:mm')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.dropoffDeadline}</p>
                  <p className="font-semibold">{format(new Date(selectedLoad.dropoffDeadline), 'dd MMM yyyy – HH:mm')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.weight}</p>
                  <p className="font-semibold">{selectedLoad.weight.toLocaleString()} kg</p>
                </div>
                {selectedLoad.pallets && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t.pallets}</p>
                    <p className="font-semibold">{selectedLoad.pallets}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">{t.temperature}</p>
                  <p className="font-semibold">{selectedLoad.temperature}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.detourDistance}</p>
                  <p className="font-semibold">{selectedLoad.detourDistance} km</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">{t.priceEstimate}</p>
                  <p className="text-2xl font-bold text-primary">{formatVND(selectedLoad.priceEstimate)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsModalOpen(false)}>{t.close}</Button>
            <Button onClick={() => {
              setDetailsModalOpen(false);
              if (selectedLoad) handleAcceptClick(selectedLoad);
            }}>{t.acceptLoad}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={acceptModalOpen} onOpenChange={setAcceptModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.confirmAcceptTitle}</DialogTitle>
            <DialogDescription>
              {t.confirmAcceptDesc}
            </DialogDescription>
          </DialogHeader>
          {selectedLoad && (
            <div className="space-y-2">
              <p className="font-semibold">{selectedLoad.origin} → {selectedLoad.destination}</p>
              <p className="text-sm text-muted-foreground">
                {t.pickup}: {format(new Date(selectedLoad.pickupDeadline), 'dd MMM yyyy – HH:mm')}
              </p>
              <p className="text-lg font-bold text-primary">{formatVND(selectedLoad.priceEstimate)}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAcceptModalOpen(false)}>{t.cancel}</Button>
            <Button onClick={handleConfirmAccept}>{t.confirmAccept}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoadOpportunities;