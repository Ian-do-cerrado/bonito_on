atualize o código com a melhor modificação sugerida "use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitContactForm, SubmitContactFormData } from "@/app/actions/contact";
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, Phone, Mail, MapPin, Clock, X } from "lucide-react"
import { useContext } from "react";
import { ContactModalContext } from "@/contexts/contact-modal-context";

interface ContactModalProps {
  attraction?: string;
}

export function ContactModal({ attraction }: ContactModalProps) {
  const { isOpen, closeModal } = useContext(ContactModalContext) as any;
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    const name = formData.get("name") as string;
    const whatsapp = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const checkin = formData.get("checkin") as string;
    const guests = formData.get("guests") as string;
    const attraction = formData.get("attraction") as string;

    const contactFormData: SubmitContactFormData = {
      name,
      whatsapp,
      email,
      checkin,
      guests,
      attraction,
    };

    try {
      const result = await submitContactForm(contactFormData);
      if (result.success) {
        toast({
          title: "Mensagem enviada!",
          description: "Entraremos em contato em breve.",
        });
        
        // Redireciona para a página tarifário após 1 segundo
        setTimeout(() => {
          window.location.href = "https://bonitoon.com.br/tarifario";
        }, 1000);
        
        closeModal();
      } else {
        toast({
          title: "Erro ao enviar",
          description: result.error || "Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
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
      {/* ... (restante do código JSX permanece EXATAMENTE o mesmo) ... */}
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
      {/* ... (restante do código JSX permanece o mesmo) ... */}
    </Dialog>
  )
}
