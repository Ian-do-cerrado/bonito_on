import { Mountain, Sparkles, Clock, Users, Compass, Headphones } from "lucide-react";
import { differentialsItems } from "../config/data";

const icons = { Mountain, Sparkles, Clock, Users, Compass, Headphones };

/* ---------- DIFFERENTIALS ---------- */
export function Differentials() {
  return (
    <section className="bg-secondary/60 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Diferenciais
          </span>
          <h2 className="mt-3 promo-text-balance text-3xl font-bold sm:text-4xl md:text-5xl">
            Por que somos referência em Bonito.
          </h2>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {differentialsItems.map((it) => {
            const Icon = icons[it.icon as keyof typeof icons];
            return (
              <div
                key={it.title}
                className="flex gap-5 rounded-3xl border border-border/70 bg-card p-6 transition-all hover:border-primary/40 hover:promo-shadow-card"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold">{it.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
