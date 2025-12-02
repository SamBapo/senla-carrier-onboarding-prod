import { Headset } from "lucide-react";
import zaloLogo from "@/assets/zalo-logo.png";

export const ZaloContactPopup = () => {
  const handleContact = () => {
    window.open("https://zalo.me/84827892241", "_blank");
  };

  return (
    <button
      onClick={handleContact}
      className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl flex items-center gap-3 px-6 py-4 transition-all hover:scale-105 group"
      aria-label="Talk to us on Zalo"
    >
      <Headset className="w-6 h-6 flex-shrink-0" />
      <span className="font-semibold text-base whitespace-nowrap">Talk to us on Zalo</span>
      <img src={zaloLogo} alt="Zalo" className="w-8 h-8 flex-shrink-0" />
    </button>
  );
};
