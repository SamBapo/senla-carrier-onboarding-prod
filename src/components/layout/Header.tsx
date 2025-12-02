import { Globe, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
      myProfile: "My Profile",
      logout: "Logout",
      loggedOut: "Logged out successfully",
    },
    vi: {
      myProfile: "Hồ Sơ Của Tôi",
      logout: "Đăng Xuất",
      loggedOut: "Đăng xuất thành công",
    },
  };

  const t = translations[language];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: t.loggedOut,
    });
    navigate("/auth");
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "vi" : "en");
  };

  return (
    <header className="h-16 border-b border-border bg-card px-8 flex items-center justify-end">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="gap-2" onClick={toggleLanguage}>
          <Globe className="w-4 h-4" />
          {language.toUpperCase()}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
              <span className="text-sm font-medium text-primary">U</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate("/my-profile")}>
              <User className="w-4 h-4 mr-2" />
              {t.myProfile}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              {t.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
