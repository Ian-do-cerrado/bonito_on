import { packages } from "../config/data";
import { PackageCard } from "./package-card";

export function Packages() {
  return (
    <section id="pacotes" className="relative bg-secondary/60 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Escolha seu pacote
          </span>
          <h2 className="mt-3 promo-text-balance text-3xl font-bold sm:text-4xl md:text-5xl">
            Três roteiros pensados para cada tipo de viajante.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Compare, escolha o que mais combina com você e solicite seu orçamento personalizado.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {packages.map((p) => (
            <PackageCard key={p.days} pkg={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
