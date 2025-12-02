import { Package, MapPin, Calendar, Thermometer, Weight, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatVND } from "@/utils/currency";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface Order {
  id: string;
  load_id: string;
  origin: string;
  destination: string;
  pickup_deadline: string;
  dropoff_deadline: string;
  weight: number;
  pallets: number | null;
  temperature: string;
  detour_distance: number;
  price_estimate: number;
  status: string;
  created_at: string;
}

const MyOrders = () => {
  const { language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const translations = {
    en: {
      title: "My Orders",
      subtitle: "View and manage your accepted load orders",
      noOrders: "No Orders Yet",
      noOrdersDesc: "Once you accept load opportunities, they will appear here for tracking and management.",
      loading: "Loading orders...",
      origin: "Origin",
      destination: "Destination",
      pickup: "Pickup",
      dropoff: "Dropoff",
      weight: "Weight",
      pallets: "Pallets",
      temperature: "Temperature",
      detourDistance: "Detour",
      priceEstimate: "Price",
      status: "Status",
      pendingConfirmation: "Pending Confirmation",
      confirmed: "Confirmed",
      inTransit: "In Transit",
      delivered: "Delivered",
      cancelled: "Cancelled",
    },
    vi: {
      title: "Đơn Hàng Của Tôi",
      subtitle: "Xem và quản lý các đơn hàng vận chuyển đã chấp nhận",
      noOrders: "Chưa Có Đơn Hàng",
      noOrdersDesc: "Khi bạn chấp nhận cơ hội vận chuyển, chúng sẽ xuất hiện ở đây để theo dõi và quản lý.",
      loading: "Đang tải đơn hàng...",
      origin: "Điểm Xuất Phát",
      destination: "Điểm Đến",
      pickup: "Lấy Hàng",
      dropoff: "Giao Hàng",
      weight: "Trọng Lượng",
      pallets: "Pallet",
      temperature: "Nhiệt Độ",
      detourDistance: "Quãng Đường Vòng",
      priceEstimate: "Giá",
      status: "Trạng Thái",
      pendingConfirmation: "Đang Chờ Xác Nhận",
      confirmed: "Đã Xác Nhận",
      inTransit: "Đang Vận Chuyển",
      delivered: "Đã Giao",
      cancelled: "Đã Hủy",
    },
  };

  const t = translations[language];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      "pending confirmation": { label: t.pendingConfirmation, variant: "secondary" },
      "confirmed": { label: t.confirmed, variant: "default" },
      "in transit": { label: t.inTransit, variant: "default" },
      "delivered": { label: t.delivered, variant: "outline" },
      "cancelled": { label: t.cancelled, variant: "destructive" },
    };

    const statusInfo = statusMap[status] || { label: status, variant: "outline" as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">{t.noOrders}</h2>
          <p className="text-muted-foreground max-w-md">{t.noOrdersDesc}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      {order.origin} → {order.destination}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t.status}: {getStatusBadge(order.status)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{formatVND(order.price_estimate)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t.pickup}</p>
                      <p className="text-sm font-medium">{format(new Date(order.pickup_deadline), "dd MMM yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t.dropoff}</p>
                      <p className="text-sm font-medium">{format(new Date(order.dropoff_deadline), "dd MMM yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Weight className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t.weight}</p>
                      <p className="text-sm font-medium">{order.weight.toLocaleString()} kg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t.temperature}</p>
                      <p className="text-sm font-medium">{order.temperature}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
