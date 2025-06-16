"use client"

import { useState, useEffect } from "react"
import { getAllTours } from "@/services/supabase-tours"
import type { Tour } from "@/types/tour"
import TourCard from "../ui/tour-card"

const ToursSection = () => {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTours() {
      try {
        const data = await getAllTours()
        setTours(data)
      } catch (error) {
        console.error("Error loading tours:", error)
      } finally {
        setLoading(false)
      }
    }
    loadTours()
  }, [])

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading tours...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Explore Our Tours</h2>
          <p className="text-gray-500">Discover amazing experiences around the world.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ToursSection
