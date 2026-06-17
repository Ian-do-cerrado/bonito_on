"use client"

import { SiteLayout } from "@/components/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"

export default function TermosUsoPage() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <SiteLayout>
      <section className="relative h-72 pt-16 bg-gradient-to-br from-[#1e2c1e] via-[#264c33] to-[#1a3b29] text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div>
            <div className="mb-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("backBtn")}
              </Button>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">{t("termosUsoTitle")}</h1>
            <p className="text-base sm:text-lg text-green-100 max-w-2xl leading-relaxed">
              {t("termosUsoDate")}
            </p>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="prose prose-lg max-w-none pt-6">
              <h2>{t("termosUso1Title")}</h2>
              <p>{t("termosUso1Body")}</p>

              <h2>{t("termosUso2Title")}</h2>
              <p>{t("termosUso2Body")}</p>
              <ul>
                <li>{t("termosUso2Li1")}</li>
                <li>{t("termosUso2Li2")}</li>
                <li>{t("termosUso2Li3")}</li>
                <li>{t("termosUso2Li4")}</li>
              </ul>

              <h2>{t("termosUso3Title")}</h2>
              <p>{t("termosUso3Body")}</p>

              <h2>{t("termosUso4Title")}</h2>
              <p>{t("termosUso4Body")}</p>

              <h2>{t("termosUso5Title")}</h2>
              <p>{t("termosUso5Body")}</p>

              <h2>{t("termosUso6Title")}</h2>
              <p>{t("termosUso6Body")}</p>

              <h2>{t("termosUso7Title")}</h2>
              <p>{t("termosUso7Body")}</p>

              <h2>{t("termosUso8Title")}</h2>
              <p>
                {t("termosUso8Body")}
                <br />
                E-mail: contato@bonitoon.com.br
                <br />
                {t("phoneLabel")}: (67) 99139-5384
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SiteLayout>
  )
}
