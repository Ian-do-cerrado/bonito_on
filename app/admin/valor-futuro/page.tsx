"use client"

import { useState, useEffect } from "react"
import { AdminTourCard2oSemestre } from "@/components/admin-tour-card-2o-semestre"
import { AddTourDialog } from "@/components/add-tour-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ArrowLeft, LogOut, BarChart3, RefreshCw } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { DatabaseTourSegundoSemestre } from "@/lib/supabase/types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  getPasseiosValorFuturoAdmin,
  updatePasseioValorFuturo,
  deletePasseioValorFuturo,
  createPasseioValorFuturo,
} from "@/lib/supabase/valor-futuro"
import { useToast } from "@/hooks/use-toast"

export default function AdminValorFuturoPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [tours, setTours] = useState<DatabaseTourSegundoSemestre[]>([])
  const [isAddTourDialogOpen, setIsAddTourDialogOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<DatabaseTourSegundoSemestre["category"]>("all")

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
 
  useEffect(() => {
    loadData()
  }, [])
 
  const loadData = async () => {
    setIsRefreshing(true)
    try {
      const { data: toursData, error } = await getPasseiosValorFuturoAdmin()
      if (error) throw error
      setTours(toursData || [])
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar os passeios do 2º semestre.",
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

  // Tour handlers
  const handleUpdateTour = async (updatedTour: DatabaseTourSegundoSemestre) => {
    const { error } = await updatePasseioValorFuturo(updatedTour.id, updatedTour)
    if (!error) {
      setTours(tours.map((tour) => (tour.id === updatedTour.id ? updatedTour : tour)))
      toast({
        title: "Sucesso",
        description: "Passeio atualizado com sucesso!",
      })
    } else {
      toast({
        title: "Erro",
        description: "Erro ao atualizar passeio",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTour = async (tourId: string) => {
    const { error } = await deletePasseioValorFuturo(tourId)
    if (!error) {
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

  const handleAddTour = async (newTour: Omit<DatabaseTourSegundoSemestre, "id" | "created_at" | "updated_at">) => {
    const { data: createdTour, error } = await createPasseioValorFuturo(newTour)
    if (createdTour && !error) {
      setTours((prevTours) => [...prevTours, createdTour])
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

  const filteredTours = activeCategory === "all" ? tours : tours.filter((tour) => tour.category === activeCategory)
 
   if (isLoading) {
     return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Site
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo - Valor Futuro</h1>
                <p className="text-gray-600">Gerencie os passeios para o próximo semestre</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Stats */}
              <div className="hidden lg:flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>{tours.length} Passeios</span>
                </div>
              </div>

              {/* Refresh Button */}
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

              {/* Add Button */}
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
        <>
          <Tabs
            value={activeCategory}
            onValueChange={(value) => setActiveCategory(value as DatabaseTourSegundoSemestre["category"])}
            className="mb-8"
          >
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1 bg-white shadow-md rounded-xl p-2">
              <TabsTrigger
                value="all"
                className="text-xs lg:text-sm rounded-lg text-black data-[state=active]:text-white data-[state=active]:bg-green-600 transition-all hover:scale-105"
              >
                {t("all")} ({tours.length})
              </TabsTrigger>
              <TabsTrigger
                value="adventure"
                className="text-xs lg:text-sm rounded-lg text-black data-[state=active]:text-white data-[state=active]:bg-green-600 transition-all hover:scale-105"
              >
                {t("adventure")} ({tours.filter((t) => t.category === "adventure").length})
              </TabsTrigger>
              <TabsTrigger
                value="contemplation"
                className="text-xs lg:text-sm rounded-lg text-black data-[state=active]:text-white data-[state=active]:bg-green-600 transition-all hover:scale-105"
              >
                {t("contemplation")} ({tours.filter((t) => t.category === "contemplation").length})
              </TabsTrigger>
              <TabsTrigger
                value="cave"
                className="text-xs lg:text-sm rounded-lg text-black data-[state=active]:text-white data-[state=active]:bg-green-600 transition-all hover:scale-105"
              >
                {t("cave")} ({tours.filter((t) => t.category === "cave").length})
              </TabsTrigger>
              <TabsTrigger
                value="waterfall"
                className="text-xs lg:text-sm rounded-lg text-black data-[state=active]:text-white data-[state=active]:bg-green-600 transition-all hover:scale-105"
              >
                {t("waterfall")} ({tours.filter((t) => t.category === "waterfall").length})
              </TabsTrigger>
              <TabsTrigger
                value="rappelling"
                className="text-xs lg:text-sm rounded-lg text-black data-[state=active]:text-white data-[state=active]:bg-green-600 transition-all hover:scale-105"
              >
                {t("rappelling")} ({tours.filter((t) => t.category === "rappelling").length})
              </TabsTrigger>
              <TabsTrigger
                value="horseback"
                className="text-xs lg:text-sm rounded-lg text-black data-[state=active]:text-white data-[state=active]:bg-green-600 transition-all hover:scale-105"
              >
                {t("horseback")} ({tours.filter((t) => t.category === "horseback").length})
              </TabsTrigger>
              <TabsTrigger
                value="biking"
                className="text-xs lg:text-sm rounded-lg text-black data-[state=active]:text-white data-[state=active]:bg-green-600 transition-all hover:scale-105"
              >
                {t("biking")} ({tours.filter((t) => t.category === "biking").length})
              </TabsTrigger>
              <TabsTrigger
                value="scubaDiving"
                className="text-xs lg:text-sm rounded-lg text-black data-[state=active]:text-white data-[state=active]:bg-green-600 transition-all hover:scale-105"
              >
                {t("scubaDiving")} ({tours.filter((t) => t.category === "scubaDiving").length})
              </TabsTrigger>
              <TabsTrigger
                value="resort"
                className="text-xs lg:text-sm rounded-lg text-black data-[state=active]:text-white data-[state=active]:bg-green-600 transition-all hover:scale-105"
              >
                {t("resort")} ({tours.filter((t) => t.category === "resort").length})
              </TabsTrigger>
              <TabsTrigger
                value="floating"
                className="text-xs lg:text-sm rounded-lg text-black data-[state=active]:text-white data-[state=active]:bg-green-600 transition-all hover:scale-105"
              >
                {t("floating")} ({tours.filter((t) => t.category === "floating").length})
              </TabsTrigger>
              <TabsTrigger
                value="pantanal"
                className="text-xs lg:text-sm rounded-lg text-black data-[state=active]:text-white data-[state=active]:bg-green-600 transition-all hover:scale-105"
              >
                {t("pantanal")} ({tours.filter((t) => t.category === "pantanal").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour, index) => (
              <div key={tour.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <AdminTourCard2oSemestre tour={tour} onUpdate={handleUpdateTour} onDelete={handleDeleteTour} />
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
                Adicionar Primeiro Passeio
              </Button>
            </div>
          )}
        </>
      </div>

      {/* Dialogs */}
      <AddTourDialog open={isAddTourDialogOpen} onOpenChange={setIsAddTourDialogOpen} onAdd={handleAddTour} />
    </div>
  )
}