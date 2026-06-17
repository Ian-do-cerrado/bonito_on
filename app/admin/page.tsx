"use client"

import { useState, useEffect, useRef } from "react"
import { AdminBlogCard } from "@/components/admin-blog-card"
import { AdminPackageCard } from "@/components/admin-package-card"
import { AdminAttractionCard } from "@/components/admin-attraction-card"
import { AddBlogDialog } from "@/components/add-blog-dialog"
import { AddPackageDialog } from "@/components/add-package-dialog"
import { AddAttractionDialog } from "@/components/add-attraction-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ArrowLeft, LogOut, BarChart3, Users, MapPin, Calendar, RefreshCw, Menu, X, UserCircle, BookOpen, Package, ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import type { BlogPost } from "@/types/index"
import type { Package } from "@/types/package"
import { Attraction } from "@/services/supabase-attractions"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { getAllTours } from "@/services/supabase-tours"
import { getAllPackages } from "@/services/supabase-packages"
import { getAllAttractions } from "@/services/supabase-attractions"
import { DatabaseTour } from "@/lib/supabase/types" // Correctly imported DatabaseTour
import { getAllBlogPosts } from "@/services/supabase-blog"
import {
  createTour,
  updateTour,
  deleteTour,
  createPackage,
  updatePackage,
  deletePackage,
  createAttraction,
  updateAttraction,
  deleteAttraction,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/services/admin-supabase"
import { useToast } from "@/hooks/use-toast"
import { AdminTourCard } from "@/components/admin-tour-card" // Ensure AdminTourCard is imported
import { AddTourDialog } from "@/components/add-tour-dialog" // Ensure AddTourDialog is imported

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [tours, setTours] = useState<DatabaseTour[]>([]) // State now uses DatabaseTour
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [isAddTourDialogOpen, setIsAddTourDialogOpen] = useState(false)
  const [isAddBlogDialogOpen, setIsAddBlogDialogOpen] = useState(false)
  const [isAddPackageDialogOpen, setIsAddPackageDialogOpen] = useState(false)
  const [isAddAttractionDialogOpen, setIsAddAttractionDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"tours" | "blog" | "packages" | "attractions" | "next-semester">("tours")
  const [activeCategory, setActiveCategory] = useState<DatabaseTour["category"]>("all") // Category type also updated
  const [activeAttractionCategory, setActiveAttractionCategory] = useState<Attraction["category"]>("gastronomy")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const tourFilterRef = useRef<HTMLDivElement>(null)
  const attrFilterRef = useRef<HTMLDivElement>(null)

  const scrollFilter = (ref: React.RefObject<HTMLDivElement>, dir: "left" | "right") => {
    const el = ref.current
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
      // getAllTours should now return DatabaseTour[] directly from supabase-tours.ts
      const [toursData, packagesData, attractionsData] = await Promise.all([
        getAllTours(),
        getAllPackages(),
        getAllAttractions(),
      ])

      setTours(toursData as DatabaseTour[]) // Cast to DatabaseTour[] to be safe after changes in supabase-tours.ts
      console.log("Tours carregados no AdminPage (raw):", toursData)
      setPackages(packagesData)
      setAttractions(attractionsData)

      const blogPostsData = await getAllBlogPosts()
      setBlogPosts(blogPostsData)
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

  // Tour handlers using DatabaseTour
  const handleUpdateTour = async (updatedTour: DatabaseTour) => {
    const success = await updateTour(updatedTour)
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

  const handleAddTour = async (newTour: Omit<DatabaseTour, "id" | "created_at" | "updated_at" | "slug">) => {
    const createdTour = await createTour(newTour)
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

  // Package handlers
  const handleUpdatePackage = async (updatedPackage: Package) => {
    const success = await updatePackage(updatedPackage)
    if (success) {
      setPackages(packages.map((pkg) => (pkg.id === updatedPackage.id ? updatedPackage : pkg)))
      toast({
        title: "Sucesso",
        description: "Pacote atualizado com sucesso!",
      })
    } else {
      toast({
        title: "Erro",
        description: "Erro ao atualizar pacote",
        variant: "destructive",
      })
    }
  }

  const handleDeletePackage = async (packageId: string) => {
    const success = await deletePackage(packageId)
    if (success) {
      setPackages(packages.filter((pkg) => pkg.id !== packageId))
      toast({
        title: "Sucesso",
        description: "Pacote excluído com sucesso!",
      })
    } else {
      toast({
        title: "Erro",
        description: "Erro ao excluir pacote",
        variant: "destructive",
      })
    }
  }

  const handleAddPackage = async (newPackage: Omit<Package, "id">) => {
    const createdPackage = await createPackage(newPackage)
    if (createdPackage) {
      setPackages([...packages, createdPackage])
      setIsAddPackageDialogOpen(false)
      toast({
        title: "Sucesso",
        description: "Pacote criado com sucesso!",
      })
    } else {
      toast({
        title: "Erro",
        description: "Erro ao criar pacote",
        variant: "destructive",
      })
    }
  }

  // Attraction handlers
  const handleUpdateAttraction = async (updatedAttraction: Attraction) => {
    const success = await updateAttraction(updatedAttraction)
    if (success) {
      setAttractions(
        attractions.map((attraction) => (attraction.id === updatedAttraction.id ? updatedAttraction : attraction)),
      )
      toast({
        title: "Sucesso",
        description: "Atração atualizada com sucesso!",
      })
    } else {
      toast({
        title: "Erro",
        description: "Erro ao atualizar atração",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAttraction = async (attractionId: string) => {
    const success = await deleteAttraction(attractionId)
    if (success) {
      setAttractions(attractions.filter((attraction) => attraction.id !== attractionId))
      toast({
        title: "Sucesso",
        description: "Atração excluída com sucesso!",
      })
    } else {
      toast({
        title: "Erro",
        description: "Erro ao excluir atração",
        variant: "destructive",
      })
    }
  }

  const handleAddAttraction = async (newAttraction: Omit<Attraction, "id">) => {
    const createdAttraction = await createAttraction(newAttraction)
    if (createdAttraction) {
      setAttractions([...attractions, createdAttraction])
      setIsAddAttractionDialogOpen(false)
      toast({
        title: "Sucesso",
        description: "Atração criada com sucesso!",
      })
    } else {
      toast({
        title: "Erro",
        description: "Erro ao criar atração",
        variant: "destructive",
      })
    }
  }

  // Blog handlers
  const handleUpdateBlogPost = async (updatedPost: BlogPost) => {
    const success = await updateBlogPost(updatedPost)
    if (success) {
      setBlogPosts(blogPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
      toast({
        title: "Sucesso",
        description: "Post atualizado com sucesso!",
      })
    } else {
      toast({
        title: "Erro",
        description: "Erro ao atualizar post",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBlogPost = async (postId: string) => {
    const success = await deleteBlogPost(postId)
    if (success) {
      setBlogPosts(blogPosts.filter((post) => post.id !== postId))
      toast({
        title: "Sucesso",
        description: "Post excluído com sucesso!",
      })
    } else {
      toast({
        title: "Erro",
        description: "Erro ao excluir post",
        variant: "destructive",
      })
    }
  }

  const handleAddBlogPost = async (newPost: Omit<BlogPost, "id">) => {
    const createdPost = await createBlogPost(newPost)
    if (createdPost) {
      setBlogPosts([...blogPosts, createdPost])
      setIsAddBlogDialogOpen(false)
      toast({
        title: "Sucesso",
        description: "Post criado com sucesso!",
      })
    } else {
      toast({
        title: "Erro",
        description: "Erro ao criar post",
        variant: "destructive",
      })
    }
  }

  const filteredTours = activeCategory === "all" ? tours : tours.filter((tour) => tour.category === activeCategory)
  const filteredAttractions = attractions.filter((attraction) => attraction.category === activeAttractionCategory)

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
      <div className="bg-white shadow-sm border-b relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-sm text-gray-600">Gerencie todo o conteúdo do site</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Métricas — visível em lg+, com wrap permitido */}
              <div className="hidden lg:flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1.5 text-green-600 font-medium">
                  <UserCircle className="w-4 h-4" />
                  {user.email}
                </span>
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>{tours.length} Passeios</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{attractions.length} Atrações</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{packages.length} Pacotes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{blogPosts.length} Posts</span>
                </div>
              </div>

              {/* Hamburguer — visível abaixo de lg */}
              <button
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label="Menu de métricas"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
              </button>

              {/* Atualizar e Sair — só no desktop */}
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

        {/* Painel mobile de métricas */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full right-0 left-0 z-50 border-t bg-white shadow-lg px-4 sm:px-6 py-4 space-y-4">
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <div className="w-full text-green-600 font-medium">{user.email}</div>
              <div className="flex items-center gap-1.5 bg-white rounded-lg px-3 py-2 shadow-sm">
                <BarChart3 className="w-4 h-4 text-green-600" />
                <span className="font-medium">{tours.length}</span>
                <span>Passeios</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white rounded-lg px-3 py-2 shadow-sm">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="font-medium">{attractions.length}</span>
                <span>Atrações</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white rounded-lg px-3 py-2 shadow-sm">
                <Users className="w-4 h-4 text-green-600" />
                <span className="font-medium">{packages.length}</span>
                <span>Pacotes</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white rounded-lg px-3 py-2 shadow-sm">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="font-medium">{blogPosts.length}</span>
                <span>Posts</span>
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
        {/* Botão Adicionar — alinhado à direita, acima das tabs */}
        <div className="flex justify-end mb-4">
          {activeTab === "tours" ? (
            <Button onClick={() => setIsAddTourDialogOpen(true)} className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Passeio
            </Button>
          ) : activeTab === "blog" ? (
            <Button onClick={() => setIsAddBlogDialogOpen(true)} className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Escrever Post
            </Button>
          ) : activeTab === "packages" ? (
            <Button onClick={() => setIsAddPackageDialogOpen(true)} className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Pacote
            </Button>
          ) : (
            <Button onClick={() => setIsAddAttractionDialogOpen(true)} className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Atração
            </Button>
          )}
        </div>

        {/* Navegação principal — underline style, scrollável */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="flex w-full overflow-x-auto scrollbar-hide bg-transparent border-b border-gray-200 p-0 h-auto rounded-none gap-0">
              <TabsTrigger
                value="tours"
                className="flex-shrink-0 flex items-center gap-2 px-5 py-4 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 text-gray-500 hover:text-gray-700 bg-transparent transition-colors whitespace-nowrap"
              >
                <BarChart3 className="w-4 h-4" />
                Passeios
              </TabsTrigger>
              <TabsTrigger
                value="attractions"
                className="flex-shrink-0 flex items-center gap-2 px-5 py-4 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 text-gray-500 hover:text-gray-700 bg-transparent transition-colors whitespace-nowrap"
              >
                <MapPin className="w-4 h-4" />
                Atrações
              </TabsTrigger>
              <TabsTrigger
                value="packages"
                className="flex-shrink-0 flex items-center gap-2 px-5 py-4 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 text-gray-500 hover:text-gray-700 bg-transparent transition-colors whitespace-nowrap"
              >
                <Package className="w-4 h-4" />
                Pacotes
              </TabsTrigger>
              <TabsTrigger
                value="blog"
                className="flex-shrink-0 flex items-center gap-2 px-5 py-4 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 text-gray-500 hover:text-gray-700 bg-transparent transition-colors whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4" />
                Blog
              </TabsTrigger>
              <TabsTrigger
                value="next-semester"
                className="flex-shrink-0 flex items-center gap-2 px-5 py-4 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 text-gray-500 hover:text-gray-700 bg-transparent transition-colors whitespace-nowrap"
              >
                <Link href="/admin/valor-futuro">Próximo Semestre</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeTab === "tours" && (
          <>
            {/* Filtro de categoria — pills scrolláveis com setas em loop */}
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 block">Filtrar por categoria</span>
              <div className="relative flex items-center gap-2">
                <button
                  onClick={() => scrollFilter(tourFilterRef, "left")}
                  className="flex-shrink-0 bg-white shadow-md rounded-full p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors z-10"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <div ref={tourFilterRef} className="flex overflow-x-auto scrollbar-hide gap-2 py-1 flex-1">
                  {([
                    ["all", t("all"), tours.length],
                    ["adventure", t("adventure"), tours.filter((t) => t.category === "adventure").length],
                    ["contemplation", t("contemplation"), tours.filter((t) => t.category === "contemplation").length],
                    ["cave", t("cave"), tours.filter((t) => t.category === "cave").length],
                    ["waterfall", t("waterfall"), tours.filter((t) => t.category === "waterfall").length],
                    ["rappelling", t("rappelling"), tours.filter((t) => t.category === "rappelling").length],
                    ["horseback", t("horseback"), tours.filter((t) => t.category === "horseback").length],
                    ["biking", t("biking"), tours.filter((t) => t.category === "biking").length],
                    ["scubaDiving", t("scubaDiving"), tours.filter((t) => t.category === "scubaDiving").length],
                    ["resort", t("resort"), tours.filter((t) => t.category === "resort").length],
                    ["floating", t("floating"), tours.filter((t) => t.category === "floating").length],
                    ["pantanal", t("pantanal"), tours.filter((t) => t.category === "pantanal").length],
                  ] as [string, string, number][]).map(([value, label, count]) => (
                    <button
                      key={value}
                      onClick={() => setActiveCategory(value as DatabaseTour["category"])}
                      className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border transition-all whitespace-nowrap shadow-sm ${
                        activeCategory === value
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
                      }`}
                    >
                      {label} <span className="ml-1 opacity-70">({count})</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => scrollFilter(tourFilterRef, "right")}
                  className="flex-shrink-0 bg-white shadow-md rounded-full p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors z-10"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour, index) => (
                <div key={tour.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <AdminTourCard tour={tour} onUpdate={handleUpdateTour} onDelete={handleDeleteTour} />
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
        )}

        {activeTab === "attractions" && (
          <>
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 block">Filtrar por categoria</span>
              <div className="relative flex items-center gap-2">
                <button
                  onClick={() => scrollFilter(attrFilterRef, "left")}
                  className="flex-shrink-0 bg-white shadow-md rounded-full p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors z-10"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <div ref={attrFilterRef} className="flex overflow-x-auto scrollbar-hide gap-2 py-1 flex-1">
                  {([
                    ["gastronomy", "Gastronomia", attractions.filter((a) => a.category === "gastronomy").length],
                    ["accommodation", "Hospedagem", attractions.filter((a) => a.category === "accommodation").length],
                    ["transport", "Transporte", attractions.filter((a) => a.category === "transport").length],
                    ["events", "Eventos", attractions.filter((a) => a.category === "events").length],
                  ] as [string, string, number][]).map(([value, label, count]) => (
                    <button
                      key={value}
                      onClick={() => setActiveAttractionCategory(value as Attraction["category"])}
                      className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border transition-all whitespace-nowrap shadow-sm ${
                        activeAttractionCategory === value
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
                      }`}
                    >
                      {label} <span className="ml-1 opacity-70">({count})</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => scrollFilter(attrFilterRef, "right")}
                  className="flex-shrink-0 bg-white shadow-md rounded-full p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors z-10"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAttractions.map((attraction, index) => (
                <div key={attraction.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <AdminAttractionCard
                    attraction={attraction}
                    onUpdate={handleUpdateAttraction}
                    onDelete={handleDeleteAttraction}
                  />
                </div>
              ))}
            </div>

            {filteredAttractions.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <div className="text-gray-400 mb-4">
                  <MapPin className="w-16 h-16 mx-auto" />
                </div>
                <p className="text-gray-500 text-lg mb-4">Nenhuma atração encontrada nesta categoria</p>
                <Button onClick={() => setIsAddAttractionDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeira Atração
                </Button>
              </div>
            )}
          </>
        )}

        {activeTab === "packages" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <div key={pkg.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <AdminPackageCard package={pkg} onUpdate={handleUpdatePackage} onDelete={handleDeletePackage} />
                </div>
              ))}
            </div>

            {packages.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <div className="text-gray-400 mb-4">
                  <Users className="w-16 h-16 mx-auto" />
                </div>
                <p className="text-gray-500 text-lg mb-4">Nenhum pacote encontrado</p>
                <Button onClick={() => setIsAddPackageDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Pacote
                </Button>
              </div>
            )}
          </>
        )}

        {activeTab === "blog" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post, index) => (
                <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <AdminBlogCard post={post} onUpdate={handleUpdateBlogPost} onDelete={handleDeleteBlogPost} />
                </div>
              ))}
            </div>

            {blogPosts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <div className="text-gray-400 mb-4">
                  <Calendar className="w-16 h-16 mx-auto" />
                </div>
                <p className="text-gray-500 text-lg mb-4">Nenhum post encontrado</p>
                <Button onClick={() => setIsAddBlogDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Escrever Primeiro Post
                </Button>
              </div>
            )}
          </>
        )}

      </div>

      {/* Dialogs */}
      <AddTourDialog open={isAddTourDialogOpen} onOpenChange={setIsAddTourDialogOpen} onAdd={handleAddTour} />
      <AddBlogDialog open={isAddBlogDialogOpen} onOpenChange={setIsAddBlogDialogOpen} onAdd={handleAddBlogPost} />
      <AddPackageDialog
        open={isAddPackageDialogOpen}
        onOpenChange={setIsAddPackageDialogOpen}
        onAdd={handleAddPackage}
      />
      <AddAttractionDialog
        open={isAddAttractionDialogOpen}
        onOpenChange={setIsAddAttractionDialogOpen}
        onAdd={handleAddAttraction}
      />

    </div>
  )
}
