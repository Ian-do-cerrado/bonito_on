"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { useContactModal } from "@/contexts/contact-modal-context"

import { Package } from "@/types/index"

interface PackageCardProps {
  packageData: Package
}

const PackageCard: React.FC<PackageCardProps> = ({ packageData }) => {
  const { openModal } = useContactModal()
  const { title, description, price, highlights: features } = packageData

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex flex-col mb-4">
        <span className="text-xl font-bold text-green-600">Consultar Valor</span>
        <span className="text-xs text-gray-400">Entre em contato para orçamentos</span>
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
