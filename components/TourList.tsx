"use client";

import { useEffect } from "react";
import { TourCard } from "@/components/tour-card";
import { gsap } from "gsap";

interface TourListProps {
  tours: any[];
}

const TourList: React.FC<TourListProps> = ({ tours }) => {
  useEffect(() => {
    if (tours.length > 0) {
      gsap.fromTo(".tour-list-card-gsap", 
        { y: 30, opacity: 0 }, 
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.8, 
          ease: "power3.out",
          overwrite: "auto"
        }
      )
    }
  }, [tours])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {tours.map((tour) => (
        <div
          key={tour.id}
          className="tour-list-card-gsap opacity-0"
        >
          <TourCard tour={tour} />
        </div>
      ))}
    </div>
  );
};

export default TourList;