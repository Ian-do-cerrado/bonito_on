"use client"

import { FaWhatsapp } from "react-icons/fa"

const WHATSAPP_NUMBER = "5567991395384"

interface WhatsAppCtaButtonProps {
  message: string
  label?: string
  className?: string
}

export function WhatsAppCtaButton({
  message,
  label = "Reservar pelo WhatsApp",
  className = "",
}: WhatsAppCtaButtonProps) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm w-full ${className}`}
    >
      <FaWhatsapp className="w-5 h-5 flex-shrink-0" />
      {label}
    </a>
  )
}
