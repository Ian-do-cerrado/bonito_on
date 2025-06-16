"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { useContactModal } from "@/contexts/contact-modal-context"

interface PackageCardProps {
  title: string
  description: string
  price: string
  features: string[]
}

const PackageCard: React.FC<PackageCardProps> = ({ title, description, price, features }) => {
  const { openModal } = useContactModal()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-center mb-4">
        <span className="text-2xl font-bold text-green-600">{price}</span>
        <span className="text-gray-500">/mes</span>
      </div>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <Button
        onClick={() => openModal(title)}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
      >
        Reservar
      </Button>
    </div>
  )
}

export default PackageCard
