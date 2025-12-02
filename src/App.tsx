import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./contexts/DataContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { ZaloContactPopup } from "./components/ZaloContactPopup";
import { useAuthSession } from "./hooks/useAuthSession";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import FindStorage from "./pages/FindStorage";
import WarehouseDetails from "./pages/WarehouseDetails";
import MyBookings from "./pages/MyBookings";
import ListAvailability from "./pages/ListAvailability";
import ManageCapacity from "./pages/ManageCapacity";
import LoadOpportunities from "./pages/LoadOpportunities";
import RegisterCarrier from "./pages/RegisterCarrier";
import MyOrders from "./pages/MyOrders";
import MyTruckOverview from "./pages/MyTruckOverview";
import Auth from "./pages/Auth";
import MyProfile from "./pages/MyProfile";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  useAuthSession();
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/find-storage" element={<ProtectedRoute><FindStorage /></ProtectedRoute>} />
                  <Route path="/warehouse/:id" element={<ProtectedRoute><WarehouseDetails /></ProtectedRoute>} />
                  <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
                  <Route path="/list-availability" element={<ProtectedRoute><ListAvailability /></ProtectedRoute>} />
                  <Route path="/manage-capacity" element={<ProtectedRoute><ManageCapacity /></ProtectedRoute>} />
                  <Route path="/load-opportunities" element={<ProtectedRoute><LoadOpportunities /></ProtectedRoute>} />
                  <Route path="/register-carrier" element={<ProtectedRoute><RegisterCarrier /></ProtectedRoute>} />
                  <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                  <Route path="/my-truck-overview" element={<ProtectedRoute><MyTruckOverview /></ProtectedRoute>} />
                  <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ZaloContactPopup />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
