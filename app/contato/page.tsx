"use client"

import { SiteLayout } from "@/components/site-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ContactForm } from "@/components/contact-form"
import { MessageCircle } from "lucide-react"

export default function ContatoPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/")
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">
        {/* Top bar */}
        <div className="pt-20 pb-4 px-4 flex items-center justify-between max-w-3xl mx-auto w-full">
          <Link href="/">
            <Button variant="ghost" size="sm" className="hover:bg-green-100 text-green-800 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-800">Agência Aberta • Resposta em 2min</span>
          </div>
        </div>

        {/* Main Content: centered card matching modal */}
        <div className="flex-1 flex items-start justify-center px-4 pb-12">
          <div className="w-full max-w-3xl">
            {/* Modal-style card */}
            <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
              {/* Header – identical to the modal header */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 sm:p-8 border-b border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-green-800">
                    Entre em Contato
                  </h1>
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">VIP</span>
                </div>
                <p className="text-green-700 text-sm sm:text-base">
                  Preencha o formulário e entraremos em contato rapidamente
                </p>
              </div>

              {/* Form body */}
              <div className="p-4 sm:p-6 space-y-2">
                <ContactForm
                  attraction={null}
                  onSuccess={handleSuccess}
                  variant="modal"
                  onCancel={() => router.push("/")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
