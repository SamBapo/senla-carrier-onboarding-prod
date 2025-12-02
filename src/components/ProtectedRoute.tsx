import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
  requireApproved?: boolean;
}

export function ProtectedRoute({ children, requireApproved = false }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);

      if (requireApproved) {
        const { data: carrier } = await supabase
          .from("carriers")
          .select("status")
          .eq("user_id", session.user.id)
          .maybeSingle();

        setIsApproved(carrier?.status === "approved");
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [requireApproved]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requireApproved && !isApproved) {
    return <Navigate to="/register-carrier" replace />;
  }

  return <>{children}</>;
}
