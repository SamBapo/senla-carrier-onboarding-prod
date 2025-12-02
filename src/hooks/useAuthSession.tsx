import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 60 minutes in milliseconds

export function useAuthSession() {
  const navigate = useNavigate();

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(async () => {
        await supabase.auth.signOut();
        navigate("/auth");
      }, INACTIVITY_TIMEOUT);
    };

    // Track user activity
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];
    events.forEach((event) => {
      document.addEventListener(event, resetTimer);
    });

    // Start the timer
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [navigate]);
}
