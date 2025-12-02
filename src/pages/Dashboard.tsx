import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuickSearch } from "@/components/QuickSearch";
import { Search, Warehouse } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Dashboard() {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Welcome to SENLA Cold Chain Logistics",
      subtitle: "Connect cold-chain warehouses with businesses that need storage",
      findStorage: "Find Storage",
      findStorageDesc: "Search and book cold storage facilities starting from 1 pallet",
      browseWarehouses: "Browse Warehouses",
      listAvailability: "List Availability",
      listAvailabilityDesc: "List your warehouse and manage cold storage capacity",
      addWarehouse: "Add Your Warehouse",
    },
    vi: {
      title: "Chào mừng đến với SENLA Cold Chain Logistics",
      subtitle: "Kết nối kho lạnh với doanh nghiệp cần lưu trữ",
      findStorage: "Tìm Kho",
      findStorageDesc: "Tìm kiếm và đặt chỗ tại kho lạnh từ 1 pallet",
      browseWarehouses: "Xem Kho",
      listAvailability: "Đăng Ký Kho",
      listAvailabilityDesc: "Đăng ký kho và quản lý sức chứa kho lạnh",
      addWarehouse: "Thêm Kho Của Bạn",
    },
  };

  const t = translations[language];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>{t.findStorage}</CardTitle>
            <CardDescription>{t.findStorageDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/find-storage">
              <Button className="w-full">{t.browseWarehouses}</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Warehouse className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>{t.listAvailability}</CardTitle>
            <CardDescription>{t.listAvailabilityDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/list-availability">
              <Button className="w-full">{t.addWarehouse}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <QuickSearch />
    </div>
  );
}
