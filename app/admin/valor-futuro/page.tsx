"use client"

import { useState, useEffect, useRef } from "react"
import { AdminTour2Card } from "@/components/admin-tour-2-card"
import { AddTour2Dialog } from "@/components/add-tour-2-dialog"
import { Button } from "@/components/ui/button"
import { Plus, LogOut, RefreshCw, BarChart3, Menu, X, UserCircle, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Tour2Data } from "@/lib/supabase/types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { getAllTours2Admin } from "@/lib/supabase/tours-2"
import { createTour2, updateTour2, deleteTour2 } from "@/services/admin-supabase"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"

const CATEGORIES: [Tour2Data["category"] | "all", string][] = [
  ["all", "Todos"],
  ["adventure", "Aventura"],
  ["contemplation", "Contemplação"],
  ["cave", "Caverna"],
  ["waterfall", "Cachoeira"],
  ["rappelling", "Rapel"],
  ["horseback", "Cavalgada"],
  ["biking", "Ciclismo"],
  ["scubaDiving", "Mergulho"],
  ["resort", "Resort"],
  ["floating", "Flutuação"],
  ["pantanal", "Pantanal"],
]

export default function AdminValorFuturoPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [tours, setTours] = useState<Tour2Data[]>([])
  const [isAddTourDialogOpen, setIsAddTourDialogOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Tour2Data["category"] | "all">("all")

  const filterRef = useRef<HTMLDivElement>(null)

  const scrollFilter = (dir: "left" | "right") => {
    const el = filterRef.current
    if (!el) return
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4
    const atStart = el.scrollLeft <= 4
    if (dir === "right") {
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" })
      else el.scrollBy({ left: 200, behavior: "smooth" })
    } else {
      if (atStart) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" })
      else el.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.auth.getSession()
        if (error || !data.session) {
          router.push("/admin/login")
          return
        }
        setUser({ id: data.session.user.id, email: data.session.user.email })
        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    if (user) loadData()
  }, [user])

  const loadData = async () => {
    setIsRefreshing(true)
    try {
      const toursData = await getAllTours2Admin()
      setTours(toursData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({ title: "Erro", description: "Erro ao carregar dados", variant: "destructive" })
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

  const handleUpdateTour = async (updatedTour: Tour2Data) => {
    const success = await updateTour2(updatedTour)
    if (success) {
      setTours(tours.map((tour) => (tour.id === updatedTour.id ? updatedTour : tour)))
      toast({ title: "Sucesso", description: "Passeio atualizado com sucesso!" })
    } else {
      toast({ title: "Erro", description: "Erro ao atualizar passeio", variant: "destructive" })
    }
  }

  const handleDeleteTour = async (tourId: string) => {
    const success = await deleteTour2(tourId)
    if (success) {
      setTours(tours.filter((tour) => tour.id !== tourId))
      toast({ title: "Sucesso", description: "Passeio excluído com sucesso!" })
    } else {
      toast({ title: "Erro", description: "Erro ao excluir passeio", variant: "destructive" })
    }
  }

  const handleAddTour = async (newTour: Omit<Tour2Data, "id">) => {
    const createdTour = await createTour2(newTour)
    if (createdTour) {
      setTours([...tours, createdTour])
      setIsAddTourDialogOpen(false)
      toast({ title: "Sucesso", description: "Passeio criado com sucesso!" })
    } else {
      toast({ title: "Erro", description: "Erro ao criar passeio", variant: "destructive" })
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

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Próximo Semestre</h1>
              <p className="text-sm text-gray-600">Gerencie os passeios do próximo semestre</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Métricas — visível em lg+ */}
              <div className="hidden lg:flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1.5 text-green-600 font-medium">
                  <UserCircle className="w-4 h-4" />
                  {user.email}
                </span>
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>{tours.length} Passeios</span>
                </div>
              </div>

              {/* Hamburguer — mobile */}
              <button
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
              </button>

              <Button onClick={loadData} disabled={isRefreshing} variant="outline" size="sm" className="hidden lg:flex hover:scale-105 transition-transform">
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm" className="hidden lg:flex hover:scale-105 transition-transform">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>

        {/* Painel mobile */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full right-0 left-0 z-50 border-t bg-white shadow-lg px-4 sm:px-6 py-4 space-y-4">
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <div className="w-full flex items-center gap-1.5 text-green-600 font-medium">
                <UserCircle className="w-4 h-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-1.5 bg-white rounded-lg px-3 py-2 shadow-sm border">
                <BarChart3 className="w-4 h-4 text-green-600" />
                <span className="font-medium">{tours.length}</span>
                <span>Passeios</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadData} disabled={isRefreshing} variant="outline" size="sm" className="flex-1">
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm" className="flex-1">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb + Adicionar */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Painel Principal
          </Link>
          <Button onClick={() => setIsAddTourDialogOpen(true)} className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Passeio
          </Button>
        </div>

        {/* Filtro de categoria — pills scrolláveis com setas em loop */}
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 block">Filtrar por categoria</span>
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => scrollFilter("left")}
              className="flex-shrink-0 bg-white shadow-md rounded-full p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors z-10"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <div ref={filterRef} className="flex overflow-x-auto scrollbar-hide gap-2 py-1 flex-1">
              {CATEGORIES.map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setActiveCategory(value)}
                  className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border transition-all whitespace-nowrap shadow-sm ${
                    activeCategory === value
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
                  }`}
                >
                  {label}{" "}
                  <span className="ml-1 opacity-70">
                    ({value === "all" ? tours.length : tours.filter((t) => t.category === value).length})
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => scrollFilter("right")}
              className="flex-shrink-0 bg-white shadow-md rounded-full p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors z-10"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Grid de passeios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour, index) => (
            <div key={tour.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <AdminTour2Card tour={tour} onUpdate={handleUpdateTour} onDelete={handleDeleteTour} />
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
      </div>

      <AddTour2Dialog open={isAddTourDialogOpen} onOpenChange={setIsAddTourDialogOpen} onAdd={handleAddTour} />
    </div>
  )
}
