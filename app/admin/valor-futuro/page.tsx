"use client"

import { useState, useEffect } from "react"
import { AdminTour2Card } from "@/components/admin-tour-2-card"
import { AddTour2Dialog } from "@/components/add-tour-2-dialog"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft, LogOut, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Tour2Data } from "@/lib/supabase/types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { getAllTours2Admin } from "@/lib/supabase/tours-2"
import { createTour2, updateTour2, deleteTour2 } from "@/services/admin-supabase"
import { useToast } from "@/hooks/use-toast"

export default function AdminValorFuturoPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [tours, setTours] = useState<Tour2Data[]>([])
  const [isAddTourDialogOpen, setIsAddTourDialogOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Tour2Data["category"]>("all")

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
      const toursData = await getAllTours2Admin()
      setTours(toursData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
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
  const handleUpdateTour = async (updatedTour: Tour2Data) => {
    const success = await updateTour2(updatedTour)
    if (success) {
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
    const success = await deleteTour2(tourId)
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

  const handleAddTour = async (newTour: Omit<Tour2Data, "id">) => {
    const createdTour = await createTour2(newTour)
    if (createdTour) {
      setTours([...tours, createdTour])
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
              <Link href="/admin">
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Painel Principal
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Editar Passeios - Próximo Semestre</h1>
                <p className="text-gray-600">Gerencie os passeios da tabela tours_2</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour, index) => (
            <div key={tour.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <AdminTour2Card tour={tour} onUpdate={handleUpdateTour} onDelete={handleDeleteTour} />
            </div>
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg mb-4">Nenhum passeio encontrado</p>
            <Button onClick={() => setIsAddTourDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Passeio
            </Button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AddTour2Dialog open={isAddTourDialogOpen} onOpenChange={setIsAddTourDialogOpen} onAdd={handleAddTour} />
    </div>
  )
}