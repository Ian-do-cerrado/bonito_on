import { WhatsAppIcon } from "./whatsapp-icon";
import { whatsappUrl } from "../config/data";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco no WhatsApp"
      className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full promo-bg-whatsapp text-white promo-shadow-premium transition-transform hover:scale-110 sm:h-16 sm:w-16"
    >
      <WhatsAppIcon className="h-7 w-7 sm:h-8 sm:w-8" />
      <span className="absolute -inset-1 -z-10 animate-ping rounded-full promo-bg-whatsapp-40" />
    </a>
  );
}
