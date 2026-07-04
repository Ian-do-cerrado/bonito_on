import { howItWorksSteps } from "../config/data";

/* ---------- HOW IT WORKS ---------- */
export function HowItWorks() {
  return (
    <section className="bg-secondary/60 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Como funciona
          </span>
          <h2 className="mt-3 promo-text-balance text-3xl font-bold sm:text-4xl md:text-5xl">
            Do primeiro contato ao check-in em Bonito.
          </h2>
        </div>

        <ol className="mt-16 grid gap-6 md:grid-cols-5">
          {howItWorksSteps.map((s) => (
            <li
              key={s.n}
              className="relative rounded-3xl border border-border/70 bg-card p-6 text-center promo-shadow-soft"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground promo-shadow-soft">
                {s.n}
              </div>
              <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
