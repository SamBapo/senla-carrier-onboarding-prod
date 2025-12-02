import { Button } from "@/components/ui/button";
import { ArrowRight, Package, TruckIcon, Calendar, Warehouse } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is logged in, redirect to appropriate page
        const { data: carrier } = await supabase
          .from("carriers")
          .select("status")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (!carrier || carrier.status !== "approved") {
          navigate("/register-carrier");
        } else {
          navigate("/my-truck-overview");
        }
      } else {
        // User is not logged in, redirect to auth page
        navigate("/auth");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return null;
};

export default Index;
