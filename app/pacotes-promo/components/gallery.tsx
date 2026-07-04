import { galleryShots } from "../config/data";

export function Gallery() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Galeria
          </span>
          <h2 className="mt-3 promo-text-balance text-3xl font-bold sm:text-4xl md:text-5xl">
            Um gostinho do que te espera.
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryShots.map((s) => (
            <figure
              key={s.label}
              className="group relative aspect-square overflow-hidden rounded-3xl bg-muted"
            >
              <img
                src={s.src}
                alt={s.label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
              <figcaption className="absolute bottom-4 left-4 text-sm font-semibold text-white">
                {s.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
