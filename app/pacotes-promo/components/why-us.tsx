import { Headphones, Sparkles, Compass, ShieldCheck, Clock, Users } from "lucide-react";
import { whyUsItems } from "../config/data";

const icons = { Headphones, Sparkles, Compass, ShieldCheck, Clock, Users };

/* ---------- WHY US ---------- */
export function WhyUs() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Por que Bonito ON
          </span>
          <h2 className="mt-3 promo-text-balance text-3xl font-bold sm:text-4xl md:text-5xl">
            Sua viagem começa com um roteiro pensado para você.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Mais de 5.000 viajantes confiaram no nosso jeito de organizar Bonito. Descubra o
            que faz a diferença.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyUsItems.map((it) => {
            const Icon = icons[it.icon as keyof typeof icons];
            return (
              <div
                key={it.title}
                className="group rounded-3xl border border-border/70 bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/40 hover:promo-shadow-card"
              >
                <div className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
