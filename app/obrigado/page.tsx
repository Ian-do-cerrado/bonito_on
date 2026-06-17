"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, MessageCircle, Phone, Mail, Clock, Star, ArrowRight, Gift, Sparkles, Rocket, Mountain, Package, BookOpen, Home } from "lucide-react"
import Link from "next/link"

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  const name = searchParams.get("name") || "Aventureiro"
  const attraction = searchParams.get("attraction")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-500" /> Parabéns, {name}!
          </h1>

          <p className="text-xl text-gray-700 mb-2">Sua solicitação foi enviada com sucesso!</p>

          {attraction && (
            <p className="text-lg text-green-700 font-semibold">
              <span className="inline-flex items-center gap-1"><Sparkles className="w-4 h-4 text-yellow-500" /> Interesse registrado em: <span className="text-green-800">{attraction}</span></span>
            </p>
          )}
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email Enviado</h3>
              <p className="text-sm text-gray-600">
                Nossa equipe foi notificada e já está preparando seu roteiro personalizado
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Resposta Rápida</h3>
              <p className="text-sm text-gray-600">
                Entraremos em contato em até <strong>15 minutos</strong> durante horário comercial
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Roteiro Grátis</h3>
              <p className="text-sm text-gray-600">
                Você receberá um roteiro personalizado <strong>sem custo</strong> algum
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mb-8 border-2 border-green-200">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2"><Rocket className="w-6 h-6 text-green-600" /> Próximos Passos</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Análise do seu perfil</h3>
                  <p className="text-gray-600 text-sm">
                    Nossa equipe está analisando suas preferências para criar o roteiro perfeito
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Contato personalizado</h3>
                  <p className="text-gray-600 text-sm">
                    Entraremos em contato via WhatsApp para entender melhor seus desejos
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Roteiro exclusivo</h3>
                  <p className="text-gray-600 text-sm">
                    Você receberá um roteiro detalhado com preços especiais e dicas secretas
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Options */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2"><MessageCircle className="w-6 h-6 text-green-600" /> Precisa falar conosco agora?</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="https://wa.me/5567991395384"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">WhatsApp Direto</h3>
                  <p className="text-sm opacity-90">Resposta imediata</p>
                </div>
                <ArrowRight className="w-5 h-5 ml-auto" />
              </a>

              <a
                href="tel:+5567991395384"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
              >
                <Phone className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Ligar Agora</h3>
                  <p className="text-sm opacity-90">(67) 99139-5384</p>
                </div>
                <ArrowRight className="w-5 h-5 ml-auto" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Social Proof */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
              ))}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Você está em ótima companhia!</h3>

            <p className="text-gray-700 mb-4">
              Mais de <strong>10.000 aventureiros</strong> já realizaram seus sonhos em Bonito conosco
            </p>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>98% de satisfação</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>15 anos de experiência</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Suporte 24h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <p className="text-gray-600">Enquanto aguarda nosso contato, que tal conhecer mais sobre Bonito?</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/atracoes">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                <Mountain className="w-4 h-4 mr-2" /> Ver Atrações
              </Button>
            </Link>

            <Link href="/pacotes">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                <Package className="w-4 h-4 mr-2" /> Conhecer Pacotes
              </Button>
            </Link>

            <Link href="/blog">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                <BookOpen className="w-4 h-4 mr-2" /> Ler Dicas de Viagem
              </Button>
            </Link>
          </div>

          <div className="pt-4">
            <Link href="/">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                <Home className="w-4 h-4 mr-2" /> Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">
            <span className="inline-flex items-center gap-1"><Mail className="w-4 h-4 text-gray-400" /> Verifique sua caixa de entrada (e spam) para confirmação do recebimento</span>
          </p>
        </div>
      </div>
    </div>
  )
}
