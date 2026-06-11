"use client";

import { Tour } from "@/types";
import { getDisplayPrice } from "@/lib/tour-price-utils";
import { SiteLayout } from "@/components/site-layout";
import Image from "next/image";
import { Star } from "lucide-react";

interface TourDetailPageProps {
  tour: Tour;
}

const TourDetailPage: React.FC<TourDetailPageProps> = ({ tour }) => {
  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="relative h-[400px] w-full">
        <Image
          src={tour.image || "/placeholder.svg"}
          alt={tour.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-white text-4xl sm:text-5xl font-bold drop-shadow-lg text-center px-4">
            {tour.title}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-gray-700 leading-relaxed space-y-4 mb-8">
  {tour.description.split("\n").map((paragraph, idx) => (
    <p key={idx}>{paragraph.trim()}</p>
  ))}
</div>


        {/* Price and Rating */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          {(() => {
            const displayPrice = getDisplayPrice(tour);
            if (displayPrice > 0) return (
              <div className="text-3xl font-bold text-green-600">
                {displayPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
            );
            return (
              <div className="text-3xl font-bold text-green-600">Consulte o valor</div>
            );
          })()}
        </div>

        {/* Reserve Button */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow hover:shadow-md text-lg">
            Reservar Agora
          </button>
          <button className="bg-white border border-green-600 text-green-600 hover:bg-green-50 font-semibold px-6 py-3 rounded-lg transition-all shadow-sm text-lg">
            Falar com um agente
          </button>
        </div>
      </section>
    </SiteLayout>
  );
};

export default TourDetailPage;
