import { NavLink } from "@/components/NavLink";
import { 
  Search, 
  Calendar, 
  Warehouse, 
  Settings,
  Truck,
  UserPlus,
  Package,
  TruckIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const transportLinks = [
  { to: "/register-carrier", icon: UserPlus, label: "Carrier Onboarding" },
  { to: "/load-opportunities", icon: Truck, label: "Load Opportunities" },
  { to: "/my-orders", icon: Package, label: "My Orders" },
  { to: "/my-truck-overview", icon: TruckIcon, label: "My Truck Overview" }
];

const warehousingLinks = [
  { to: "/find-storage", icon: Search, label: "Find Storage" },
  { to: "/my-bookings", icon: Calendar, label: "My Bookings" },
  { to: "/list-availability", icon: Warehouse, label: "List Availability" },
  { to: "/manage-capacity", icon: Settings, label: "Manage Capacity" }
];

export function Sidebar() {
  const { language } = useLanguage();

  const translations = {
    en: {
      subtitle: "Cold Chain Logistics",
      transport: "Transport",
      carrierOnboarding: "Carrier Onboarding",
      loadOpportunities: "Load Opportunities",
      myOrders: "My Orders",
      myTruckOverview: "My Truck Overview",
      warehousing: "Warehousing",
      findStorage: "Find Storage",
      myBookings: "My Bookings",
      listAvailability: "List Availability",
      manageCapacity: "Manage Capacity",
    },
    vi: {
      subtitle: "Logistics Chuỗi Lạnh",
      transport: "Vận Tải",
      carrierOnboarding: "Đăng Ký Nhà Vận Chuyển",
      loadOpportunities: "Cơ Hội Vận Chuyển",
      myOrders: "Đơn Hàng Của Tôi",
      myTruckOverview: "Tổng Quan Xe Tải",
      warehousing: "Kho Bãi",
      findStorage: "Tìm Kho",
      myBookings: "Đặt Chỗ Của Tôi",
      listAvailability: "Đăng Ký Kho",
      manageCapacity: "Quản Lý Công Suất",
    },
  };

  const t = translations[language];

  const transportLinks = [
    { to: "/register-carrier", icon: UserPlus, label: t.carrierOnboarding },
    { to: "/load-opportunities", icon: Truck, label: t.loadOpportunities },
    { to: "/my-orders", icon: Package, label: t.myOrders },
    { to: "/my-truck-overview", icon: TruckIcon, label: t.myTruckOverview }
  ];

  const warehousingLinks = [
    { to: "/find-storage", icon: Search, label: t.findStorage },
    { to: "/my-bookings", icon: Calendar, label: t.myBookings },
    { to: "/list-availability", icon: Warehouse, label: t.listAvailability },
    { to: "/manage-capacity", icon: Settings, label: t.manageCapacity }
  ];

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">SENLA</h1>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </div>

      <nav className="flex-1 space-y-8">
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
            {t.transport}
          </h3>
          <ul className="space-y-1">
            {transportLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
                  activeClassName="bg-accent text-accent-foreground font-medium"
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Warehousing section hidden but code preserved */}
        {false && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
              {t.warehousing}
            </h3>
            <ul className="space-y-1">
              {warehousingLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
                    activeClassName="bg-accent text-accent-foreground font-medium"
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <div className="pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">U</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">User</p>
            <p className="text-xs text-muted-foreground">user@senla.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
