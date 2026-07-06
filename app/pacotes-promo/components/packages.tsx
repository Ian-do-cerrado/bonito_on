import { packages } from "../config/data";
import { PackagesCarousel } from "./packages-carousel";

export function Packages() {
  return (
    <section id="pacotes" className="relative scroll-mt-20 bg-secondary/60 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Escolha seu pacote
          </span>
          <h2 className="mt-3 promo-text-balance text-3xl font-bold sm:text-4xl md:text-5xl">
            Roteiros pensados para cada tipo de viajante.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Compare, escolha o que mais combina com você e solicite seu orçamento personalizado.
          </p>
        </div>

        <PackagesCarousel packages={packages} />
      </div>
    </section>
  );
}
