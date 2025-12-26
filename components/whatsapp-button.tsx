"use client";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const phoneNumber = "5567991395384";
  const message = encodeURIComponent(
    "Olá! Vim do site Bonito ON e gostaria de mais informações."
  );
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-600 p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50 flex items-center justify-center wiggle"
      aria-label="WhatsApp"
    >
      <FaWhatsapp className="text-white h-12 w-12" />
    </a>
  );
}