"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, Shield, Lock, Zap, Search, Calendar, Users, Car, X } from "lucide-react"

export default function ContactForm() {
  const [temCriancas, setTemCriancas] = useState(false)
  const [quantasCriancas, setQuantasCriancas] = useState("")
  const [temTransporte, setTemTransporte] = useState(false)
  const [showBanner, setShowBanner] = useState(true)

  return (
    <div className="w-full max-w-md">
      {/* Urgency Banner */}
      {showBanner && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-t-xl flex items-center justify-between relative">
          <div className="flex items-center gap-2 mx-auto">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-sm font-semibold">🔥 VAGAS LIMITADAS: Reserve antes que esgote!</span>
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Card */}
      <Card className={`shadow-2xl border-0 ${showBanner ? "rounded-t-none" : "rounded-xl"}`}>
        <CardContent className="p-6 space-y-5">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-800">Entre em Contato</h1>
              <Badge className="bg-emerald-600 text-white text-xs">VIP</Badge>
            </div>
            <p className="text-gray-500 text-sm">Preencha e te respondemos agora pelo WhatsApp</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Nome e WhatsApp */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Nome completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Como podemos te chamar?"
                  className="border-emerald-500 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  WhatsApp <span className="text-red-500">*</span>
                </Label>
                <Input placeholder="(67) 99139-5384" className="border-gray-200" />
              </div>
            </div>

            {/* Data prevista para viagem */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium flex items-center gap-1">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Data prevista para viagem <span className="text-red-500">*</span>
              </Label>
              <Input type="date" className="border-gray-200" />
            </div>

            {/* Vem com crianças */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="criancas"
                  checked={temCriancas}
                  onCheckedChange={(checked) => setTemCriancas(checked as boolean)}
                  className="border-emerald-500 data-[state=checked]:bg-emerald-600"
                />
                <Label htmlFor="criancas" className="text-sm font-medium flex items-center gap-1 cursor-pointer">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Vem com crianças?
                </Label>
              </div>
              {temCriancas && (
                <div className="ml-6">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Quantas crianças?"
                    value={quantasCriancas}
                    onChange={(e) => setQuantasCriancas(e.target.value)}
                    className="border-gray-200 max-w-[180px]"
                  />
                </div>
              )}
            </div>

            {/* Vem com transporte próprio */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="transporte"
                checked={temTransporte}
                onCheckedChange={(checked) => setTemTransporte(checked as boolean)}
                className="border-emerald-500 data-[state=checked]:bg-emerald-600"
              />
              <Label htmlFor="transporte" className="text-sm font-medium flex items-center gap-1 cursor-pointer">
                <Car className="w-4 h-4 text-emerald-600" />
                Vem com transporte próprio?
              </Label>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Seu roteiro personalizado</span>
              <Badge className="bg-emerald-600 text-white text-xs">GRÁTIS</Badge>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-yellow-400 via-orange-400 to-emerald-500 rounded-full" />
            </div>
            <p className="text-xs text-gray-500">Informe Nome e WhatsApp para receber agora.</p>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-emerald-600" />
              100% Seguro
            </div>
            <div className="flex items-center gap-1">
              <Lock className="w-4 h-4 text-amber-500" />
              Dados Protegidos
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-emerald-600" />
              Resposta Rápida
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 text-base">
              <Search className="w-4 h-4 mr-2" />🎯 Garantir minha vaga agora!
            </Button>
            <Button variant="ghost" className="w-full text-gray-500 hover:text-gray-700 text-sm font-normal" asChild>
              <a href="https://wa.me/5567991395384" target="_blank" rel="noopener noreferrer">
                Não quero preencher
              </a>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                J
              </div>
              <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                M
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                A
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                +
              </div>
            </div>
            <div className="text-sm">
              <span className="font-bold text-gray-800">+2.847 viajantes</span>
              <p className="text-gray-500 text-xs">realizaram o sonho este mês</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Options */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Phone className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">WhatsApp Direto</p>
              <p className="text-xs text-gray-500">Resposta em 2 minutos ⚡</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-blue-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">Email Prioritário</p>
              <p className="text-xs text-gray-500">Roteiro em 15 minutos 🎯</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
