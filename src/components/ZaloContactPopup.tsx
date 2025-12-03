import { Headset } from "lucide-react";
import zaloLogo from "@/assets/zalo-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

export const ZaloContactPopup = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      talkToUs: "Talk to us on Zalo",
    },
    vi: {
      talkToUs: "Liên hệ qua Zalo",
    },
  };

  const t = translations[language];

  const handleContact = () => {
    window.open("https://zalo.me/84827892241", "_blank");
  };

  return (
    <button
      onClick={handleContact}
      className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl flex items-center gap-3 px-6 py-4 transition-all hover:scale-105 group"
      aria-label={t.talkToUs}
    >
      <Headset className="w-6 h-6 flex-shrink-0" />
      <span className="font-semibold text-base whitespace-nowrap">{t.talkToUs}</span>
      <img src={zaloLogo} alt="Zalo" className="w-8 h-8 flex-shrink-0" />
    </button>
  );
};