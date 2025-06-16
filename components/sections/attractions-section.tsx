"use client"

import { useState, useEffect } from "react"
import type { Attraction } from "@/types/attraction"
import AttractionCard from "@/components/ui/attraction-card"
import { getAllAttractions } from "@/services/supabase-attractions"

const AttractionsSection = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAttractions() {
      try {
        const data = await getAllAttractions()
        setAttractions(data)
      } catch (error) {
        console.error("Error loading attractions:", error)
      } finally {
        setLoading(false)
      }
    }
    loadAttractions()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading attractions...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Explore Top Attractions</h2>
          <p className="text-gray-600">Discover amazing places and activities for an unforgettable experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {attractions.map((attraction) => (
            <AttractionCard key={attraction.id} attraction={attraction} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AttractionsSection
