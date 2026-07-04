"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export function PackageCarousel({ images }: { images: { src: string; alt: string }[] }) {
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
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-3 opacity-0 transition-opacity group-hover:opacity-100" />
      <CarouselNext className="right-3 opacity-0 transition-opacity group-hover:opacity-100" />
    </Carousel>
  );
}
