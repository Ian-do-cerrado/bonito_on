import { WhatsAppIcon } from "./whatsapp-icon";
import { whatsappUrl } from "../config/data";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 promo-bg-brand-dark-95 text-white backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2">
          <img src="/pacotes-promo/logo.svg" alt="Bonito ON" className="h-10 w-auto sm:h-12" />
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground promo-shadow-soft transition-all hover:promo-bg-primary-dark hover:promo-shadow-card sm:px-6 sm:py-3 sm:text-sm"
        >
          <WhatsAppIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Solicitar Orçamento</span>
          <span className="sm:hidden">Orçamento</span>
        </a>
      </div>
    </header>
  );
}
