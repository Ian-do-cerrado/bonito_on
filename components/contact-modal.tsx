"use client"

import { useState, useEffect, useContext } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitContactForm, SubmitContactFormData } from "@/app/actions/contact";
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, Phone, Mail, MapPin, Clock, X } from "lucide-react"
import { ContactModalContext } from "@/contexts/contact-modal-context";

interface ContactModalProps {
  attraction?: string;
}

export function ContactModal({ attraction }: ContactModalProps) {
  const { isOpen, closeModal } = useContext(ContactModalContext) as any;
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  // Efeito para redirecionamento seguro
  useEffect(() => {
    if (shouldRedirect) {
      window.location.href = "https://bonitoon.com.br/tarifario";
    }
  }, [shouldRedirect])

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      const result = await submitContactForm({
        name: formData.get("name") as string,
        whatsapp: formData.get("phone") as string,
        email: formData.get("email") as string,
        checkin: formData.get("checkin") as string,
        guests: formData.get("guests") as string,
        attraction: formData.get("attraction") as string,
      });

      if (result.success) {
        toast({
          title: "Mensagem enviada!",
          description: "Redirecionando para o tarifário...",
        });
        
        closeModal();
        setShouldRedirect(true); // Ativa o redirecionamento via useEffect
        return; // Importante para evitar execução adicional
      }

      toast({
        title: "Erro ao enviar",
        description: result.error || "Tente novamente mais tarde.",
        variant: "destructive",
      });

    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 border-b border-green-200">
          <div className="flex items-center justify-between">
            <DialogHeader className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <DialogTitle className="text-xl sm:text-2xl font-bold text-green-800">
                  {attraction ? `Interesse em: ${attraction || ""}` : "Entre em Contato"}
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
              <X className="h-2 w-5" />
            </Button>
          </div>
        </div>

        <div className="pt-2 px-4 sm:pt-3 sm:px-4 space-y-2">
          {/* Banner de urgência */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 animate-pulse"></div>
            <div className="relative z-10 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <span className="font-bold text-xs sm:text-sm">🔥 VAGAS LIMITADAS: Reserve antes que esgote!</span>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce animation-delay-200"></div>
            </div>
          </div>

          <form action={handleSubmit} className="space-y-2">
            {attraction && <input type="hidden" name="attraction" value={attraction || ""} />}

            {/* Seus campos de formulário aqui... (mantenha todos os campos existentes) */}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeModal} className="order-2 sm:order-1 h-11">
                Talvez depois
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex-1 order-1 sm:order-2 h-11 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Criando sua aventura...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />🎯 Garantir minha vaga agora!
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Restante do conteúdo do modal... (mantenha todo o conteúdo existente) */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
