"use client"

import { useState, useEffect } from "react"

export function useContactModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShownAutoModal, setHasShownAutoModal] = useState(false)

  useEffect(() => {
    // Check if auto modal was already shown in this session
    const autoModalShown = sessionStorage.getItem("autoModalShown")

    if (autoModalShown) {
      setHasShownAutoModal(true)
      return
    }

    // Show modal after 4 seconds if not shown yet
    const timer = setTimeout(() => {
      if (!hasShownAutoModal) {
        setIsOpen(true)
        setHasShownAutoModal(true)
        sessionStorage.setItem("autoModalShown", "true")
      }
    }, 4000)

    return () => clearTimeout(timer)
  }, [hasShownAutoModal])

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // Adicionar listener para detectar quando o modal é fechado pelo Dialog
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeModal()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  return {
    isOpen,
    openModal,
    closeModal,
  }
}