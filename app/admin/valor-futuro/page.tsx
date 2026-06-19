"use client"

import { useState, useEffect } from "react"
import { AdminTourCard } from "@/components/admin-tour-card"
import { AddTourDialog } from "@/components/add-tour-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ArrowLeft, LogOut, RefreshCw, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Tour } from "@/types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import {
  createTour,
  updateTour,
  deleteTour,
} from "@/app/actions/tour-admin"
import { useToast } from "@/hooks/use-toast"

export default function AdminValorFuturoPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [tours, setTours] = useState<Tour[]>([])
  const [isAddTourDialogOpen, setIsAddTourDialogOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Tour["category"] | "all">("all")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.auth.getSession()

        if (error || !data.session) {
          router.push("/admin/login")
          return
        }

        setUser({
          id: data.session.user.id,
          email: data.session.user.email,
        })
        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch("/api/tours?semester=2", { cache: "no-store" })
      if (!res.ok) throw new Error("Falha ao carregar passeios")
      const toursData: Tour[] = await res.json()
      setTours(toursData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do 2º semestre",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/admin/login")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const handleUpdateTour = async (updatedTour: Tour) => {
    const result = await updateTour(updatedTour)
    if (result.success) {
      setTours(tours.map((tour) => (tour.id === updatedTour.id ? updatedTour : tour)))
      toast({
        title: "Sucesso",
        description: result.governanceSkipped
          ? "Passeio salvo. Preços do 2º semestre exigem migração SQL no Supabase (add_semester_pricing_governance.sql)."
          : "Passeio atualizado com sucesso!",
      })
      return true
    }
    toast({
      title: "Erro",
      description: result.error ?? "Erro ao atualizar passeio",
      variant: "destructive",
    })
    return false
  }

  const handleDeleteTour = async (tourId: string) => {
    const success = await deleteTour(tourId)
    if (success) {
      setTours(tours.filter((tour) => tour.id !== tourId))
      toast({
        title: "Sucesso",
        description: "Passeio excluído com sucesso!",
      })
    } else {
      toast({
        title: "Erro",
        description: "Erro ao excluir passeio",
        variant: "destructive",
      })
    }
  }

  const handleAddTour = async (newTour: Omit<Tour, "id">) => {
    const createdTour = await createTour(newTour as any)
    if (createdTour) {
      await loadData()
      setIsAddTourDialogOpen(false)
      toast({
        title: "Sucesso",
        description: "Passeio criado com sucesso!",
      })
    } else {
      toast({
        title: "Erro",
        description: "Erro ao criar passeio",
        variant: "destructive",
      })
    }
  }

  const filteredTours =
    activeCategory === "all" ? tours : tours.filter((tour) => tour.category === activeCategory)

  const CATEGORY_ORDER: Tour["category"][] = [
    "adventure", "contemplation", "cave", "waterfall", "rappelling", "horseback",
    "biking", "scubaDiving", "floating", "resort", "pantanal", "cultural", "family",
  ]
  const tourCategoryCounts = tours.reduce<Record<string, number>>((acc, tour) => {
    const cat = tour.category || "other"
    acc[cat] = (acc[cat] ?? 0) + 1
    return acc
  }, {})
  const presentCategories = Object.keys(tourCategoryCounts)
  const orderedCategories = [
    ...CATEGORY_ORDER.filter((c) => presentCategories.includes(c)),
    ...presentCategories.filter((c) => !(CATEGORY_ORDER as string[]).includes(c)),
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel do 2º semestre...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Painel Principal
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Editar Passeios — 2º Semestre</h1>
                <p className="text-gray-600">
                  Mesmos passeios e painel do 1º semestre, com tarifas BTMS do próximo semestre. Alterações de preço do 2º sem. partem da configuração atual do 1º sem.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={loadData}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="hover:scale-105 transition-transform"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Atualizar
              </Button>

              <Button
                onClick={() => setIsAddTourDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Passeio
              </Button>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="hover:scale-105 transition-transform"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeCategory}
          onValueChange={(value) => setActiveCategory(value as Tour["category"] | "all")}
          className="mb-8"
        >
          <div className="relative group">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-white shadow-sm rounded-xl p-2 w-full justify-start border border-gray-100">
              <TabsTrigger value="all" className="text-xs font-medium px-4 py-2 shrink-0 rounded-lg data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700 data-[state=active]:shadow-none">
                {t("all")} <span className="ml-1 opacity-60">({tours.length})</span>
              </TabsTrigger>
              {orderedCategories.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="text-xs font-medium px-4 py-2 shrink-0 rounded-lg data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700">
                  {t(cat)} <span className="ml-1 opacity-60">({tourCategoryCounts[cat] ?? 0})</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour, index) => (
            <div key={tour.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <AdminTourCard
                tour={tour}
                onUpdate={handleUpdateTour}
                onDelete={handleDeleteTour}
                semester="s2"
              />
            </div>
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-gray-400 mb-4">
              <BarChart3 className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg mb-4">Nenhum passeio encontrado nesta categoria</p>
            <Button onClick={() => setIsAddTourDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Passeio
            </Button>
          </div>
        )}
      </div>

      <AddTourDialog open={isAddTourDialogOpen} onOpenChange={setIsAddTourDialogOpen} onAdd={handleAddTour} />
    </div>
  )
}
