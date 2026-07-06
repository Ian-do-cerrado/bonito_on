"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export function PackageCarousel({
  images,
}: {
  images: { src: string; alt: string; tour: string }[];
}) {
  return (
    <Carousel opts={{ loop: true }} className="group relative">
      <CarouselContent>
        {images.map((img, i) => (
          <CarouselItem key={i}>
            <div className="relative aspect-square overflow-hidden">
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/60 to-transparent px-3 py-1.5 text-[11px] font-medium text-white/90">
                {img.tour}
              </span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-3 opacity-0 transition-opacity group-hover:opacity-100" />
      <CarouselNext className="right-3 opacity-0 transition-opacity group-hover:opacity-100" />
    </Carousel>
  );
}
