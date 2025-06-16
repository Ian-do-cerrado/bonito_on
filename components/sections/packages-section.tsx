"use client"

import { useState, useEffect } from "react"
import type { Package } from "@/types/package"
import PackageCard from "@/components/package-card"
import { getAllPackages } from "@/services/supabase-packages"

const PackagesSection = () => {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPackages() {
      try {
        const data = await getAllPackages()
        setPackages(data)
      } catch (error) {
        console.error("Error loading packages:", error)
      } finally {
        setLoading(false)
      }
    }
    loadPackages()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading packages...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Explore Our Packages</h2>
          <p className="text-gray-600">Choose the perfect package for your needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} packageData={pkg} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PackagesSection
