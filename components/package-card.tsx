"use client"

import type React from "react"
// SUSPENDED: import { Button } from "@/components/ui/button"
// SUSPENDED: import { useContactModal } from "@/contexts/contact-modal-context"
import { WhatsAppCtaButton } from "@/components/whatsapp-cta-button"

interface PackageCardProps {
  title: string
  description: string
  price: string
  features: string[]
}

const PackageCard: React.FC<PackageCardProps> = ({ title, description, price, features }) => {
  // SUSPENDED: const { openModal } = useContactModal()

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
      {/*
      SUSPENDED:
      <Button
        onClick={() => openModal(title)}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
      >
        Reservar
      </Button>
      */}
      {/*
      SUSPENDED:
      <a
        href={`https://wa.me/5567991395384?text=${encodeURIComponent(`Olá! Vim do site Bonito ON e gostaria de mais informações sobre o pacote ${title}.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full mt-4 inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Fale Com um Especialista
      </a>
      */}
      <WhatsAppCtaButton
        message={`Olá! Vim do site Bonito ON e gostaria de reservar o pacote ${title}.`}
        label="Reservar pelo WhatsApp"
      />
    </div>
  )
}

export default PackageCard
