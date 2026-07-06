import { comparisonRows, packages } from "../config/data";

/* ---------- COMPARISON ---------- */
export function Comparison() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Comparativo
          </span>
          <h2 className="mt-3 promo-text-balance text-3xl font-bold sm:text-4xl md:text-5xl">
            Compare os pacotes lado a lado.
          </h2>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-border/70 bg-card promo-shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="bg-secondary/60 text-left">
                  <th className="px-6 py-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Recurso
                  </th>
                  {packages.map((p) => (
                    <th
                      key={p.id}
                      className={[
                        "px-6 py-5 text-center text-sm font-bold",
                        p.featured ? "bg-primary/10 text-primary" : "text-foreground",
                      ].join(" ")}
                    >
                      {p.days} dias
                      <span className="mt-1 block text-xs font-medium normal-case text-muted-foreground">
                        {p.shortLabel}
                      </span>
                      {p.featured && (
                        <span className="mt-1 inline-block rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                          Popular
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(({ label, values }, idx) => (
                  <tr
                    key={label}
                    className={idx % 2 === 0 ? "bg-background" : "bg-secondary/30"}
                  >
                    <td className="px-6 py-4 font-medium">{label}</td>
                    {values.map((v, i) => (
                      <td
                        key={i}
                        className={[
                          "px-6 py-4 text-center",
                          packages[i]?.featured ? "bg-primary/5 font-semibold promo-text-primary-dark" : "",
                        ].join(" ")}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
