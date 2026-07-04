import { Check, X } from "lucide-react";
import { includedItems, notIncludedItems } from "../config/data";

/* ---------- INCLUDED / NOT INCLUDED ---------- */
export function IncludedSection() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Transparência
          </span>
          <h2 className="mt-3 promo-text-balance text-3xl font-bold sm:text-4xl md:text-5xl">
            O que está incluso nos pacotes.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-primary/30 bg-primary/5 p-8">
            <h3 className="flex items-center gap-2 text-lg font-bold promo-text-primary-dark">
              <Check className="h-5 w-5" strokeWidth={3} /> Incluso
            </h3>
            <ul className="mt-6 space-y-3">
              {includedItems.map((i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-sm">{i}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-8">
            <h3 className="flex items-center gap-2 text-lg font-bold text-muted-foreground">
              <X className="h-5 w-5" /> Não incluso
            </h3>
            <ul className="mt-6 space-y-3">
              {notIncludedItems.map((i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-muted">
                    <X className="h-3 w-3" />
                  </span>
                  <span className="text-sm">{i}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
