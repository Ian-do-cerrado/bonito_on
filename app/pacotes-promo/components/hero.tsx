import { MapPin, Check } from "lucide-react";
import { WhatsAppIcon } from "./whatsapp-icon";

/* ---------- HERO ---------- */
export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/pacotes-promo/hero-bonito.jpg"
          className="h-full w-full object-cover"
        >
          <source src="/file.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 promo-hero-gradient" />
      </div>

      <div className="mx-auto grid min-h-[92vh] max-w-7xl grid-cols-1 items-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5" /> Bonito • Mato Grosso do Sul
          </span>

          <h1 className="mt-6 promo-text-balance text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
            Conheça Bonito do jeito mais completo possível.
          </h1>

          <p className="mt-6 max-w-2xl promo-text-balance text-base leading-relaxed text-white/85 sm:text-lg">
            Escolha entre roteiros de 2, 3 ou 4 dias e viva experiências inesquecíveis com
            flutuações, cachoeiras, grutas e aventura em um dos destinos mais incríveis do
            Brasil.
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/90">
            {["Pacotes prontos", "Atendimento especializado", "Melhores atrações"].map((b) => (
              <li key={b} className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#pacotes"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground promo-shadow-premium transition-all hover:promo-bg-primary-dark hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Quero montar meu roteiro
            </a>
            <a
              href="#pacotes"
              className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/5 px-6 py-4 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/15"
            >
              Ver pacotes
            </a>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-4 border-t border-white/20 pt-8 sm:max-w-xl sm:gap-8">
            <Stat value="+5.000" label="viajantes atendidos" />
            <Stat value="100%" label="atendimento especializado" />
            <Stat value="Premium" label="experiências selecionadas" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-white">
      <div className="text-2xl font-bold sm:text-3xl">{value}</div>
      <div className="mt-1 text-xs leading-tight text-white/75 sm:text-sm">{label}</div>
    </div>
  );
}
