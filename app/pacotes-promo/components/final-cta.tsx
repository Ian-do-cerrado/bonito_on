import { WhatsAppIcon } from "./whatsapp-icon";
import { whatsappUrl } from "../config/data";

export function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10">
        <img
          src="/pacotes-promo/estrela-formoso.jpg"
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-primary/85" />
      </div>

      <div className="mx-auto max-w-4xl px-4 text-center text-primary-foreground sm:px-6 lg:px-8">
        <h2 className="promo-text-balance text-3xl font-extrabold sm:text-4xl md:text-5xl lg:text-6xl">
          Pronto para viver uma experiência inesquecível em Bonito?
        </h2>
        <p className="mt-6 promo-text-balance text-lg text-primary-foreground/90">
          Escolha seu pacote e fale agora com nossa equipe.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-background px-8 py-4 text-base font-bold text-primary promo-shadow-premium transition-all hover:-translate-y-0.5"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Quero montar meu roteiro
        </a>
      </div>
    </section>
  );
}
