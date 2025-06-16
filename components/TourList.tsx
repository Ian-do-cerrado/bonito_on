"use client";

import { useState, useEffect } from "react";
import { TourCard } from "@/components/tour-card";
import { Tour } from "@/services/supabase-tours";

interface TourListProps {
  tours: any[];
}

const TourList: React.FC<TourListProps> = ({ tours }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {tours.map((tour, index) => (
        <div
          key={tour.id}
          className="animate-fade-in-up hover:animate-bounce-subtle"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <TourCard tour={tour} />
        </div>
      ))}
    </div>
  );
};

export default TourList;