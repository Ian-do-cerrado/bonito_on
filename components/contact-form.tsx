"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitContactForm, SubmitContactFormData } from "@/app/actions/contact"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, Phone, Mail, MapPin, Clock, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface ContactFormProps {
  attraction?: string | null
  onSuccess: () => void
  variant: "modal" | "page"
  onCancel?: () => void
}

export function ContactForm({ attraction, onSuccess, variant, onCancel }: ContactFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    setIsSubmitting(true)

    const name = formData.get("name") as string
    const whatsapp = formData.get("phone") as string
    const email = formData.get("email") as string
    const checkin = formData.get("checkin") as string
    const guests = formData.get("guests") as string
    const attractionValue = formData.get("attraction") as string
    const message = formData.get("message") as string


    const contactFormData: SubmitContactFormData = {
      name,
      whatsapp,
      email,
      checkin,
      guests,
      attraction: attractionValue || "",
      message,
    }

    try {
      const result = await submitContactForm(contactFormData)
      if (result.success) {
        toast({
          title: "Mensagem enviada!",
          description: "Entraremos em contato em breve.",
        })
        onSuccess()
      } else {
        toast({
          title: "Erro ao enviar",
          description: result.error || "Tente novamente mais tarde.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formContent = (
    <>
      {variant === "modal" && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 animate-pulse"></div>
          <div className="relative z-10 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <span className="font-bold text-xs sm:text-sm">🔥 VAGAS LIMITADAS: Reserve antes que esgote!</span>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce animation-delay-200"></div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        {attraction && <input type="hidden" name="attraction" value={attraction} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 group">
            <Label htmlFor="contact-name" className="text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full group-focus-within:animate-pulse"></span>
              Nome completo *
            </Label>
            <Input
              id="contact-name"
              name="name"
              required
              placeholder="Como podemos te chamar?"
              className="h-10 sm:h-11 border-2 focus:border-green-500 focus:ring-green-500 transition-all duration-300"
            />
          </div>

          <div className="space-y-2 group">
            <Label htmlFor="contact-phone" className="text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full group-focus-within:animate-pulse"></span>
              WhatsApp *
            </Label>
            <Input
              id="contact-phone"
              name="phone"
              type="tel"
              required
              placeholder="(67) 99139-5384"
              className="h-10 sm:h-11 border-2 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
        </div>

        <div className="space-y-2 group">
          <Label htmlFor="contact-email" className="text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full group-focus-within:animate-pulse"></span>
            Email *
          </Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="Para enviarmos seu roteiro exclusivo"
            className="h-10 sm:h-11 border-2 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 group">
            <Label htmlFor="contact-checkin" className="text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full group-focus-within:animate-pulse"></span>
              Quando vem nos visitar?
            </Label>
            <Input
              id="contact-checkin"
              name="checkin"
              type="date"
              className="h-10 sm:h-11 border-2 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300"
            />
          </div>

          <div className="space-y-2 group">
            <Label htmlFor="contact-guests" className="text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-pink-500 rounded-full group-focus-within:animate-pulse"></span>
              Quantos aventureiros?
            </Label>
            <Input
              id="contact-guests"
              name="guests"
              type="number"
              min="1"
              placeholder="2 pessoas"
              className="h-10 sm:h-11 border-2 focus:border-pink-500 focus:ring-pink-500 transition-all duration-300"
            />
          </div>
        </div>

        <div className="space-y-2 group">
          <Label htmlFor="contact-message" className="text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full group-focus-within:animate-pulse"></span>
            Mensagem (Opcional)
          </Label>
          <Textarea
            id="contact-message"
            name="message"
            placeholder="Como podemos ajudar você a planejar sua viagem?"
            className="min-h-[100px] border-2 focus:border-yellow-500 focus:ring-yellow-500 transition-all duration-300"
          />
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-green-800">Seu roteiro personalizado</span>
            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">GRÁTIS</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2 mb-2">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-1/3 animate-pulse"></div>
          </div>
          <p className="text-xs text-green-700">Preencha os dados acima para garantir sua vaga!</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[8px]">✓</span>
              </div>
              <span>100% Seguro</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[8px]">🔒</span>
              </div>
              <span>Dados Protegidos</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[8px]">⚡</span>
              </div>
              <span>Resposta Rápida</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {variant === "modal" && onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="order-2 sm:order-1 h-11">
              Talvez depois
            </Button>
          )}
          {variant === "page" && onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="order-2 sm:order-1 h-11">
              Voltar
            </Button>
          )}
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

      <div className="flex items-center justify-center gap-4 py-2">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
            J
          </div>
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
            M
          </div>
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
            +
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-800">+2.847 viajantes</p>
          <p className="text-xs text-gray-600">realizaram o sonho este mês</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <div className="group flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-full group-hover:scale-110 transition-transform">
            <Phone className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm sm:text-base">WhatsApp Direto</p>
            <p className="text-gray-600 text-xs sm:text-sm">Resposta em 2 minutos ⚡</p>
          </div>
          <div className="ml-auto">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="group flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-full group-hover:scale-110 transition-transform">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm sm:text-base">Email Prioritário</p>
            <p className="text-gray-600 text-xs sm:text-sm">Roteiro em 15 minutos 🎯</p>
          </div>
          <div className="ml-auto">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-300"></div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">★</span>
          </div>
          <h4 className="font-bold text-amber-800">Benefícios Exclusivos VIP</h4>
        </div>
        <div className="grid grid-cols-1 gap-2 text-xs text-amber-700 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
            <span>Roteiro personalizado GRÁTIS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
            <span>Vagas limitadas por data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
            <span>Suporte 24h durante a viagem</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
            <span>Acesso a locais secretos</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-green-500" />
          <span>⚡ Resposta em até 2 minutos durante horário comercial</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span>📍 Rua Coronel Pilad Rebuá, 1997 - Centro, Bonito - MS</span>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">
            🌟 <span className="font-semibold text-green-600">Mais de 10.000 aventureiros</span> já realizaram seus
            sonhos conosco!
          </p>
        </div>
      </div>
    </>
  )

  return <div className="space-y-2">{formContent}</div>
}
