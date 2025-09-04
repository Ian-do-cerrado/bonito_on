"use client"

import { useState, useEffect } from "react"
import { AdminTourCard } from "@/components/admin-tour-card"
import { AdminBlogCard } from "@/components/admin-blog-card"
import { AdminPackageCard } from "@/components/admin-package-card"
import { AdminAttractionCard } from "@/components/admin-attraction-card"
import { AddTourDialog } from "@/components/add-tour-dialog"
import { AddBlogDialog } from "@/components/add-blog-dialog"
import { AddPackageDialog } from "@/components/add-package-dialog"
import { AddAttractionDialog } from "@/components/add-attraction-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ArrowLeft, LogOut, BarChart3, Users, MapPin, Calendar, RefreshCw } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { Tour } from "@/components/tours-section"
import type { BlogPost } from "@/types/index"
import type { Package } from "@/types/package"
import { Attraction } from "@/services/supabase-attractions"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { getAllTours } from "@/services/supabase-tours"
import { getAllPackages } from "@/services/supabase-packages"
import { getAllAttractions } from "@/services/supabase-attractions"
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

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [tours, setTours] = useState<Tour[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [isAddTourDialogOpen, setIsAddTourDialogOpen] = useState(false)
  const [isAddBlogDialogOpen, setIsAddBlogDialogOpen] = useState(false)
  const [isAddPackageDialogOpen, setIsAddPackageDialogOpen] = useState(false)
  const [isAddAttractionDialogOpen, setIsAddAttractionDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"tours" | "blog" | "packages" | "attractions">("tours")
  const [activeCategory, setActiveCategory] = useState<Tour["category"]>("all")
  const [activeAttractionCategory, setActiveAttractionCategory] = useState<Attraction["category"]>("gastronomy")

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
      const [toursData, packagesData, attractionsData] = await Promise.all([
        getAllTours(),
        getAllPackages(),
        getAllAttractions(),
      ])

      setTours(toursData)
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

  // Tour handlers
  const handleUpdateTour = async (updatedTour: Tour) => {
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

  const handleAddTour = async (newTour: Omit<Tour, "id">) => {
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

  const filteredTours = tours.filter((tour) => tour.category === activeCategory)
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
                <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-gray-600">Gerencie todo o conteúdo do site</p>
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
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{attractions.length} Atrações</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{packages.length} Pacotes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{blogPosts.length} Posts</span>
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
              {activeTab === "tours" ? (
                <Button
                  onClick={() => setIsAddTourDialogOpen(true)}
                  className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Passeio
                </Button>
              ) : activeTab === "blog" ? (
                <Button
                  onClick={() => setIsAddBlogDialogOpen(true)}
                  className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Escrever Post
                </Button>
              ) : activeTab === "packages" ? (
                <Button
                  onClick={() => setIsAddPackageDialogOpen(true)}
                  className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Pacote
                </Button>
              ) : (
                <Button
                  onClick={() => setIsAddAttractionDialogOpen(true)}
                  className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Atração
                </Button>
              )}

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
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white shadow-lg rounded-xl p-2">
            <TabsTrigger
              value="tours"
              className="rounded-lg font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all hover:scale-105"
            >
              Gerenciar Passeios
            </TabsTrigger>
            <TabsTrigger
              value="attractions"
              className="rounded-lg font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all hover:scale-105"
            >
              Gerenciar Atrações
            </TabsTrigger>
            <TabsTrigger
              value="packages"
              className="rounded-lg font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all hover:scale-105"
            >
              Gerenciar Pacotes
            </TabsTrigger>
            <TabsTrigger
              value="blog"
              className="rounded-lg font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all hover:scale-105"
            >
              Gerenciar Blog
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "tours" && (
          <>
            <Tabs
              value={activeCategory}
              onValueChange={(value) => setActiveCategory(value as Tour["category"])}
              className="mb-8"
            >
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1 bg-white shadow-md rounded-xl p-2">
                <TabsTrigger
                  value="all"
                  className="text-xs lg:text-sm rounded-lg text-black data-[state=active]:text-white data-[state=active]:bg-green-600 transition-all hover:scale-105"
                >
                  {t("all")} ({tours.filter((t) => t.category === "all").length})
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
            <Tabs
              value={activeAttractionCategory}
              onValueChange={(value) => setActiveAttractionCategory(value as Attraction["category"])}
              className="mb-8"
            >
              <TabsList className="grid w-full grid-cols-4 gap-1 bg-white shadow-md rounded-xl p-2">
                <TabsTrigger value="gastronomy" className="text-sm rounded-lg">
                  Gastronomia ({attractions.filter((a) => a.category === "gastronomy").length})
                </TabsTrigger>
                <TabsTrigger value="accommodation" className="text-sm rounded-lg">
                  Hospedagem ({attractions.filter((a) => a.category === "accommodation").length})
                </TabsTrigger>
                <TabsTrigger value="transport" className="text-sm rounded-lg">
                  Transporte ({attractions.filter((a) => a.category === "transport").length})
                </TabsTrigger>
                <TabsTrigger value="events" className="text-sm rounded-lg">
                  Eventos ({attractions.filter((a) => a.category === "events").length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

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
