"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { PackageCard } from "./package-card";
import type { Pkg } from "../config/data";

export function PackagesCarousel({ packages }: { packages: Pkg[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!api) return;

    setScrollSnaps(api.scrollSnapList());
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="mt-16">
      <Carousel setApi={setApi} opts={{ align: "start" }} className="w-full">
        <CarouselContent className="-ml-6">
          {packages.map((p) => (
            <CarouselItem key={p.id} className="basis-[88%] pl-6 sm:basis-1/2 lg:basis-1/3">
              <PackageCard pkg={p} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <button
          type="button"
          aria-label="Pacote anterior"
          onClick={() => api?.scrollPrev()}
          className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-background/90 text-foreground shadow-lg backdrop-blur transition-colors hover:bg-secondary sm:left-4"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Próximo pacote"
          onClick={() => api?.scrollNext()}
          className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-background/90 text-foreground shadow-lg backdrop-blur transition-colors hover:bg-secondary sm:right-4"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </Carousel>

      <div className="mt-6 flex justify-center gap-2">
        {scrollSnaps.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir para o pacote ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={[
              "h-2.5 rounded-full transition-all",
              i === selectedIndex ? "w-6 bg-primary" : "w-2.5 bg-border hover:bg-primary/50",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
