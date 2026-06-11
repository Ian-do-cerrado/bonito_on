"use client"

import { useContext } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { ContactModalContext } from "@/contexts/contact-modal-context"
import { ContactForm } from "@/components/contact-form"

interface ContactModalProps {
  attraction?: string
}

export function ContactModal({ attraction: propAttraction }: ContactModalProps) {
  const { isOpen, closeModal, attraction: contextAttraction } = useContext(ContactModalContext) as any
  const attraction = propAttraction ?? contextAttraction

  const handleOpenChange = (open: boolean) => {
    if (!open) closeModal()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 border-b border-green-200">
          <div className="flex items-center justify-between">
            <DialogHeader className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <DialogTitle className="text-xl sm:text-2xl font-bold text-green-800">
                  {attraction ? `Interesse em: ${attraction}` : "Entre em Contato"}
                </DialogTitle>
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">VIP</span>
              </div>
              <p className="text-green-700 text-sm sm:text-base">
                Preencha o formulário e entraremos em contato rapidamente
              </p>
            </DialogHeader>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeModal}
              className="text-green-600 hover:bg-green-100 p-2 sm:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="pt-2 px-4 sm:pt-3 sm:px-4 space-y-2 pb-4">
          <ContactForm
            attraction={attraction}
            onSuccess={closeModal}
            variant="modal"
            onCancel={closeModal}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
