import { Waves, Check, X, Star } from "lucide-react";
import { WhatsAppIcon } from "./whatsapp-icon";
import { PackageCarousel } from "./package-carousel";
import { WHATSAPP_NUMBER, type Pkg } from "../config/data";

export function PackageCard({ pkg }: { pkg: Pkg }) {
  const buildMsg = () =>
    encodeURIComponent(
      `Olá, vim do Google! Gostaria de receber um orçamento para o pacote de ${pkg.days} dias em Bonito (${pkg.title}).`,
    );
  return (
    <article
      className={[
        "relative flex flex-col overflow-hidden rounded-3xl border bg-card transition-all",
        pkg.featured
          ? "border-primary/50 promo-shadow-premium lg:-translate-y-4 lg:scale-[1.02]"
          : "border-border/70 promo-shadow-soft hover:-translate-y-1 hover:promo-shadow-card",
      ].join(" ")}
    >
      <PackageCarousel images={pkg.images} />

      <div className="flex flex-1 flex-col p-6 lg:p-8">
        {pkg.featured && (
          <span className="absolute right-6 top-6 z-10 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground promo-shadow-soft">
            <Star className="h-3 w-3 fill-current" /> Mais escolhido
          </span>
        )}

        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-extrabold text-primary">{pkg.days}</span>
          <span className="text-lg font-semibold text-muted-foreground">dias</span>
        </div>

      <h3 className="mt-3 text-xl font-bold leading-snug">{pkg.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pkg.desc}</p>

      <div className="mt-6 space-y-4 border-t border-border/60 pt-6 text-sm">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Passeios
          </h4>
          <ul className="mt-3 space-y-2">
            {pkg.tours.map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Waves className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Inclui
          </h4>
          <ul className="mt-3 space-y-2">
            {pkg.includes.map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {pkg.excludes && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Não inclui
            </h4>
            <ul className="mt-3 space-y-2">
              {pkg.excludes.map((t) => (
                <li key={t} className="flex items-start gap-2 text-muted-foreground">
                  <X className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildMsg()}`}
        target="_blank"
        rel="noopener noreferrer"
        className={[
          "mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all",
          pkg.featured
            ? "bg-primary text-primary-foreground promo-shadow-soft hover:promo-bg-primary-dark"
            : "border border-primary/40 bg-background text-primary hover:bg-primary hover:text-primary-foreground",
        ].join(" ")}
      >
        <WhatsAppIcon className="h-4 w-4" />
        Quero esse pacote
      </a>
      </div>
    </article>
  );
}
