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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Plus, ArrowLeft, LogOut, BarChart3, Users, MapPin, Calendar, RefreshCw, Search } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { Tour, BlogPost, Package, Attraction } from "@/types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { getDisplayPrice } from "@/lib/tour-price-utils"
import {
  createTour,
  updateTour,
  deleteTour,
} from "@/app/actions/tour-admin"
import {
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
import { syncTourPrices } from "@/app/actions/sync-prices"
import { getMaintenanceMode, setMaintenanceMode, getInitialValueType, setInitialValueType as setInitialValueTypeAction, getLastPricesSyncAt } from "@/app/actions/settings"
import { fetchAllAdminData } from "@/app/actions/admin-data"
import { clearTourCache } from "@/app/actions/revalidate"
import { gsap } from "gsap"

const FIRST_SEM_MAIN_CELL_KEY = "s1:alta:adulto"
const SECOND_SEM_MAIN_CELL_KEY = "s2:alta:adulto"

function getVisiblePriceOverrideByKeys(visiblePrices: string[] | undefined, cellKeys: string[]): string | null {
  if (!Array.isArray(visiblePrices)) return null
  const entry = visiblePrices.find((value) => cellKeys.some((key) => value === key || value.startsWith(key + "#")))
  if (!entry || !entry.includes("#")) return null
  return entry.substring(entry.indexOf("#") + 1)
}

function getVisiblePriceOverride(visiblePrices: string[] | undefined, cellKey: string): string | null {
  return getVisiblePriceOverrideByKeys(visiblePrices, [cellKey])
}

function setVisiblePriceOverride(
  visiblePrices: string[] | undefined,
  cellKey: string,
  legacyKeysOrOverride: string[] | string | null = [],
  overrideMaybe?: string | null
): string[] | undefined {
  const legacyKeys = Array.isArray(legacyKeysOrOverride) ? legacyKeysOrOverride : []
  const override = Array.isArray(legacyKeysOrOverride)
    ? (overrideMaybe ?? null)
    : legacyKeysOrOverride
  const base = Array.isArray(visiblePrices) ? visiblePrices : []
  const keys = [cellKey, ...legacyKeys]
  const filtered = base.filter((value) => !keys.some((key) => value === key || value.startsWith(key + "#")))
  if (!override || override === "__auto__") {
    return filtered.length > 0 ? filtered : undefined
  }
  return [...filtered, `${cellKey}#${override}`]
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const { t, initialValueType, setInitialValueType } = useLanguage()
  const { toast } = useToast()
  const [tours, setTours] = useState<Tour[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [isAddTourDialogOpen, setIsAddTourDialogOpen] = useState(false)
  const [isAddBlogDialogOpen, setIsAddBlogDialogOpen] = useState(false)
  const [isAddPackageDialogOpen, setIsAddPackageDialogOpen] = useState(false)
  const [isAddAttractionDialogOpen, setIsAddAttractionDialogOpen] = useState(false)
  const [isSyncingPrices, setIsSyncingPrices] = useState(false)
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [isUpdatingMaintenance, setIsUpdatingMaintenance] = useState(false)
  const [isUpdatingInitialValue, setIsUpdatingInitialValue] = useState(false)
  const [activeTab, setActiveTab] = useState<"pricing" | "tours" | "blog" | "packages" | "attractions" | "tours-2o-semester" | "next-semester">("pricing")
  const [tours2oSemester, setTours2oSemester] = useState<Tour[]>([])
  const [isLoadingTours2o, setIsLoadingTours2o] = useState(false)
  const [searchQuery2o, setSearchQuery2o] = useState("")
  const [activeCategory, setActiveCategory] = useState<Tour["category"] | "all">("all")
  const [activeAttractionCategory, setActiveAttractionCategory] = useState<Attraction["category"]>("gastronomy")
  const [lastSyncDate, setLastSyncDate] = useState<string | null>(null)
  const [syncRuns, setSyncRuns] = useState<Array<{ id: string; semester: string; status: string; started_at: string; rows_loaded: number; tours_updated: number }>>([])
  const [pricingSearch, setPricingSearch] = useState("")
  const [pricingSemester, setPricingSemester] = useState<"s1" | "s2">("s1")

  useEffect(() => {
    if (!isLoading) {
      gsap.fromTo(".admin-card-gsap",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto"
        }
      )
    }
  }, [isLoading, activeTab, activeCategory, activeAttractionCategory, tours])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.auth.getSession()

        if (error || !data.session) {
          router.push("/admin/login")
          setIsLoading(false)
          return
        }

        setUser({
          id: data.session.user.id,
          email: data.session.user.email,
        })
      } catch (err) {
        console.error("Erro ao verificar autenticação:", err)
        router.push("/admin/login")
      } finally {
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
    const shouldLoadS2 =
      activeTab === "tours-2o-semester" ||
      (activeTab === "pricing" && pricingSemester === "s2")

    if (shouldLoadS2 && tours2oSemester.length === 0) {
      const fetchTours2o = async () => {
        setIsLoadingTours2o(true)
        try {
          const res = await fetch("/api/tours?semester=2")
          if (res.ok) {
            const data = await res.json()
            setTours2oSemester(data)
          }
        } catch (e) {
          console.error(e)
        } finally {
          setIsLoadingTours2o(false)
        }
      }
      fetchTours2o()
    }
  }, [activeTab, pricingSemester, tours2oSemester.length, user])

  const loadData = async () => {
    setIsRefreshing(true)
    try {
      const { toursData, packagesData, attractionsData, blogData } = await fetchAllAdminData()

      setTours(Array.isArray(toursData) ? toursData : [])
      setPackages(Array.isArray(packagesData) ? packagesData : [])
      setAttractions(Array.isArray(attractionsData) ? attractionsData : [])
      setBlogPosts(Array.isArray(blogData) ? blogData : [])

      const shouldLoadS2 =
        activeTab === "tours-2o-semester" ||
        (activeTab === "pricing" && pricingSemester === "s2") ||
        tours2oSemester.length > 0

      if (shouldLoadS2) {
        const res = await fetch("/api/tours?semester=2")
        if (res.ok) {
          const data = await res.json()
          setTours2oSemester(data)
        }
      }
      
      const syncSettingsDate = await getLastPricesSyncAt()
      if (syncSettingsDate) {
        setLastSyncDate(syncSettingsDate)
      }
      const supabase = createClient()
      const { data: runs } = await supabase
        .from("price_sync_runs")
        .select("id, semester, status, started_at, rows_loaded, tours_updated")
        .order("started_at", { ascending: false })
        .limit(5)
      if (runs) setSyncRuns(runs as any)

      const mMode = await getMaintenanceMode()
      setIsMaintenanceMode(mMode)

      const ivType = await getInitialValueType()
      setInitialValueType(ivType)
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
    const result = await updateTour(updatedTour)
    if (result.success) {
      setTours((prev) => prev.map((tour) => (tour.id === updatedTour.id ? updatedTour : tour)))
      setTours2oSemester((prev) => prev.map((tour) => (tour.id === updatedTour.id ? updatedTour : tour)))
      clearTourCache(updatedTour.slug).catch(console.error)
      toast({
        title: "Sucesso",
        description: result.governanceSkipped
          ? "Passeio salvo. Preços do 2º semestre exigem migração SQL no Supabase (add_semester_pricing_governance.sql)."
          : "Passeio atualizado com sucesso e site atualizado!",
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
    const tourToDelete = tours.find(t => t.id === tourId)
    const success = await deleteTour(tourId)
    if (success) {
      setTours(tours.filter((tour) => tour.id !== tourId))
      if (tourToDelete) await clearTourCache(tourToDelete.slug)
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

  const handleSyncPrices = async () => {
    setIsSyncingPrices(true)
    try {
      const result = await syncTourPrices()
      if (result.success) {
        const parts = [`${result.updated} de ${result.total} passeios atualizados`]
        if (result.descriptionsCleaned > 0) {
          parts.push(`${result.descriptionsCleaned} descrição(ões) sem preços obsoletos`)
        }
        toast({
          title: "Preços sincronizados",
          description: parts.join(". "),
        })
        setLastSyncDate(new Date().toISOString())
        loadData()
      } else {
        toast({
          title: "Erro ao sincronizar",
          description: result.errors?.join(", ") || "Erro desconhecido",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Erro ao sincronizar preços",
        variant: "destructive",
      })
    } finally {
      setIsSyncingPrices(false)
    }
  }

  const handleToggleMaintenance = async () => {
    setIsUpdatingMaintenance(true)
    const newValue = !isMaintenanceMode
    const success = await setMaintenanceMode(newValue)
    if (success) {
      setIsMaintenanceMode(newValue)
      toast({
        title: newValue ? "Manutenção Ativada" : "Manutenção Desativada",
        description: newValue 
          ? "O site agora está visível apenas para administradores." 
          : "O site agora está público novamente.",
      })
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o modo manutenção.",
        variant: "destructive",
      })
    }
    setIsUpdatingMaintenance(false)
  }

  const handleToggleInitialValueType = async () => {
    setIsUpdatingInitialValue(true)
    const newValue = initialValueType === "main_activity" ? "min_price" : "main_activity"
    const success = await setInitialValueTypeAction(newValue)
    if (success) {
      setInitialValueType(newValue)
      toast({
        title: "Lógica de Preços Alterada",
        description: newValue === "main_activity" 
          ? "O site agora prioriza a atividade principal para o valor inicial." 
          : "O site agora exibe sempre o menor preço absoluto da tabela.",
      })
      // Opcional: Sugerir sincronização
      toast({
        title: "Dica",
        description: "Recomendamos clicar em 'Sincronizar' para atualizar os valores salvos no banco de dados.",
      })
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível alterar a lógica de preços.",
        variant: "destructive",
      })
    }
    setIsUpdatingInitialValue(false)
  }

  const handleAddTour = async (newTour: Omit<Tour, "id">) => {
    const createdTour = await createTour(newTour)
    if (createdTour) {
      setTours([...tours, createdTour])
      await clearTourCache(createdTour.slug)
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
      return true
    } else {
      toast({
        title: "Erro",
        description: "Erro ao atualizar pacote",
        variant: "destructive",
      })
      return false
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
      return true
    } else {
      toast({
        title: "Erro",
        description: "Erro ao atualizar atração",
        variant: "destructive",
      })
      return false
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
      return true
    } else {
      toast({
        title: "Erro",
        description: "Erro ao atualizar post",
        variant: "destructive",
      })
      return false
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

  const filteredTours =
    activeCategory === "all" ? tours : tours.filter((tour) => tour.category === activeCategory)

  // Abas de categoria geradas dinamicamente a partir das categorias presentes nos passeios,
  // garantindo que toda categoria existente apareça (mesmo as fora da lista canônica).
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

  const filteredAttractions = attractions.filter((attraction) => attraction.category === activeAttractionCategory)
  const pricingRows = pricingSemester === "s1" ? tours : tours2oSemester
  const pricingRowsFiltered = pricingRows.filter((tour) =>
    tour.title.toLowerCase().includes(pricingSearch.toLowerCase())
  )

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

            <div className="flex flex-wrap items-center gap-4">
              {/* Profile & Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold shrink-0">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-green-600 font-medium hidden md:block">{user.email}</span>
                </div>
                
                <div className="hidden lg:flex items-center space-x-6 shrink-0 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-green-600" />
                    <span><strong className="text-gray-900">{tours.length}</strong> Passeios</span>
                  </div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span><strong className="text-gray-900">{attractions.length}</strong> Atrações</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span><strong className="text-gray-900">{packages.length}</strong> Pacotes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span><strong className="text-gray-900">{blogPosts.length}</strong> Posts</span>
                  </div>
                </div>
              </div>

              {/* Actions Group */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Refresh */}
                <Button
                  onClick={loadData}
                  disabled={isRefreshing}
                  variant="secondary"
                  size="sm"
                  className="bg-white border-gray-200 hover:bg-gray-50 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Atualizar
                </Button>
                
                {/* Maintenance Toggle */}
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                  <span className={`text-[10px] font-bold uppercase ${isMaintenanceMode ? "text-orange-600" : "text-gray-400"}`}>
                    {isMaintenanceMode ? "Manutenção ON" : "Site Público"}
                  </span>
                  <button
                    onClick={handleToggleMaintenance}
                    disabled={isUpdatingMaintenance}
                    className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
                      isMaintenanceMode ? "bg-orange-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`${
                        isMaintenanceMode ? "translate-x-4" : "translate-x-1"
                      } inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform`}
                    />
                  </button>
                </div>

                {/* Initial Value Logic Toggle */}
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Valores Iniciais</span>
                    <span className={`text-[10px] font-medium ${initialValueType === "min_price" ? "text-blue-600" : "text-green-600"}`}>
                      {initialValueType === "min_price" ? "MENOR PREÇO" : "MATCH IDEAL"}
                    </span>
                  </div>
                  <button
                    onClick={handleToggleInitialValueType}
                    disabled={isUpdatingInitialValue}
                    title={initialValueType === "min_price" ? "Mudar para Match Ideal (Principal)" : "Mudar para Menor Preço Absoluto"}
                    className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
                      initialValueType === "min_price" ? "bg-blue-500" : "bg-green-500"
                    }`}
                  >
                    <span
                      className={`${
                        initialValueType === "min_price" ? "translate-x-4" : "translate-x-1"
                      } inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform`}
                    />
                  </button>
                </div>

                <div className="h-6 w-[1px] bg-gray-200 mx-1 hidden sm:block" />

                {/* Primary Actions */}
                <div className="flex items-center gap-2">
                  {activeTab === "pricing" || activeTab === "tours" || activeTab === "tours-2o-semester" ? (
                    <>
                      <Button
                        onClick={handleSyncPrices}
                        disabled={isSyncingPrices}
                        variant="outline"
                        size="sm"
                        className="border-green-600 text-green-600 hover:bg-green-50 shadow-sm"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isSyncingPrices ? "animate-spin" : ""}`} />
                        Sincronizar
                      </Button>
                      {activeTab === "tours" && (
                        <Button
                          onClick={() => setIsAddTourDialogOpen(true)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 shadow-sm"
                        >
                          <Plus className="w-4 h-4 mr-1.5" />
                          Passeio
                        </Button>
                      )}
                    </>
                  ) : activeTab === "blog" ? (
                    <Button
                      onClick={() => setIsAddBlogDialogOpen(true)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 shadow-sm"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Post
                    </Button>
                  ) : activeTab === "packages" ? (
                    <Button
                      onClick={() => setIsAddPackageDialogOpen(true)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 shadow-sm"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Pacote
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setIsAddAttractionDialogOpen(true)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 shadow-sm"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Atração
                    </Button>
                  )}
                </div>

                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-600 flex flex-wrap items-center gap-3">
          <span>
            Ultimo sync: {lastSyncDate ? new Date(lastSyncDate).toLocaleString("pt-BR") : "nunca"}
          </span>
          {syncRuns.slice(0, 3).map((run) => (
            <span key={run.id} className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2 py-1">
              {run.semester.toUpperCase()} • {run.status} • {new Date(run.started_at).toLocaleString("pt-BR")}
            </span>
          ))}
        </div>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-white shadow-lg rounded-xl p-2 h-auto gap-1">
            <TabsTrigger
              value="pricing"
              className="rounded-lg font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all hover:scale-105"
            >
              Painel de Preços
            </TabsTrigger>
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
            <TabsTrigger
              value="next-semester"
              className="rounded-lg font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all hover:scale-105"
              asChild
            >
              <Link href="/admin/valor-futuro">Editar 2º Semestre</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "pricing" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-green-100">
                <CardHeader className="pb-2">
                  <h3 className="text-sm font-semibold text-gray-800">Semestre em edicao</h3>
                </CardHeader>
                <CardContent>
                  <Select value={pricingSemester} onValueChange={(v) => setPricingSemester(v as "s1" | "s2")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s1">S1 (vigente)</SelectItem>
                      <SelectItem value="s2">S2 (proximo semestre)</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-sm font-semibold text-gray-800">Ultima sincronizacao</h3>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  {lastSyncDate ? new Date(lastSyncDate).toLocaleString("pt-BR") : "Nenhuma sincronizacao registrada"}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-sm font-semibold text-gray-800">Execucoes recentes</h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  {syncRuns.slice(0, 2).map((run) => (
                    <div key={run.id} className="text-xs text-gray-600 border border-gray-200 rounded-md px-2 py-1">
                      {run.semester.toUpperCase()} • {run.status} • {new Date(run.started_at).toLocaleString("pt-BR")}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Gestao de preco principal e manual ({pricingSemester.toUpperCase()})</h3>
                    <p className="text-sm text-gray-500">
                      Ajuste o valor principal do card/pagina e o valor manual sem sair desta tela.
                    </p>
                  </div>
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Buscar passeio..."
                      value={pricingSearch}
                      onChange={(e) => setPricingSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                        <th className="py-3 px-3">Passeio</th>
                        <th className="py-3 px-3">Preco exibido</th>
                        <th className="py-3 px-3">BTMS automatico</th>
                        <th className="py-3 px-3 w-80">Principal BTMS (card/pagina)</th>
                        <th className="py-3 px-3 w-44">Manual</th>
                        <th className="py-3 px-3 text-right">Acoes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {pricingRowsFiltered.map((tour) => {
                        const isS2 = pricingSemester === "s2"
                        const tourS1 = tours.find((t) => t.id === tour.id) ?? tour
                        const display = getDisplayPrice(tourS1, "main_activity", isS2)
                        const calculated = getDisplayPrice(
                          { ...tourS1, manual_price: null, manual_price_2o_semester: null, price_2o_semester: null, price: 0 } as any,
                          "main_activity",
                          isS2
                        )
                        const overrideKeys = isS2
                          ? [SECOND_SEM_MAIN_CELL_KEY, "alta:adulto"]
                          : [FIRST_SEM_MAIN_CELL_KEY, "alta:adulto"]
                        const override = getVisiblePriceOverrideByKeys(tour.visible_prices, overrideKeys)
                        const selectValue = override ?? "__auto__"
                        const rows = Array.isArray(tour.prices?.rows) ? tour.prices.rows : []
                        const options = [
                          ...rows.filter((r: any) => Number(r?.adulto ?? r?.garupaAdulto) > 0),
                          ...rows.filter((r: any) => Number(r?.adulto ?? r?.garupaAdulto) <= 0),
                        ]
                        const manualValue = isS2 ? (tour.manual_price_2o_semester ?? null) : (tour.manual_price ?? null)

                        return (
                          <tr key={`${pricingSemester}-${tour.id}`} className="hover:bg-gray-50/60">
                            <td className="py-3 px-3 font-medium text-gray-900">{tour.title}</td>
                            <td className="py-3 px-3">
                              {display > 0 ? display.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}
                            </td>
                            <td className="py-3 px-3 text-green-700">
                              {calculated > 0 ? calculated.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}
                            </td>
                            <td className="py-3 px-3">
                              <Select
                                value={selectValue}
                                onValueChange={async (value) => {
                                  const nextVisiblePrices = setVisiblePriceOverride(
                                    tour.visible_prices,
                                    isS2 ? SECOND_SEM_MAIN_CELL_KEY : FIRST_SEM_MAIN_CELL_KEY,
                                    ["alta:adulto"],
                                    value === "__auto__" ? null : value
                                  )
                                  const updated = { ...tour, visible_prices: nextVisiblePrices }
                                  const success = await handleUpdateTour(updated)
                                  if (success) {
                                    setTours((prev) => prev.map((item) => (item.id === tour.id ? updated : item)))
                                    setTours2oSemester((prev) => prev.map((item) => (item.id === tour.id ? updated : item)))
                                  }
                                }}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="Automático (BTMS)">
                                    {selectValue === "__auto__" ? "Automático (BTMS)" : "Valor BTMS selecionado"}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__auto__">Automático (BTMS)</SelectItem>
                                  {options.map((row: any, index: number) => {
                                    const optionValue = `${row.nomeTabela}#${row.atividade}`
                                    const resolvedValue = Number(row.adulto ?? row.garupaAdulto)
                                    const formattedValue =
                                      resolvedValue > 0
                                        ? resolvedValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                                        : "—"
                                    return (
                                      <SelectItem key={`${optionValue}-${index}`} value={optionValue}>
                                        {`${row.atividade} • ${row.nomeTabela} • ${formattedValue}`}
                                      </SelectItem>
                                    )
                                  })}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3 px-3">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="Automático"
                                defaultValue={manualValue ?? ""}
                                onBlur={async (e) => {
                                  const parsed = e.target.value === "" ? null : parseFloat(e.target.value)
                                  if (parsed !== manualValue) {
                                    const updated = isS2
                                      ? { ...tour, manual_price_2o_semester: parsed }
                                      : { ...tour, manual_price: parsed }
                                    const success = await handleUpdateTour(updated)
                                    if (success) {
                                      setTours((prev) => prev.map((item) => (item.id === tour.id ? updated : item)))
                                      setTours2oSemester((prev) => prev.map((item) => (item.id === tour.id ? updated : item)))
                                    }
                                  }
                                }}
                                className="h-8 text-xs"
                              />
                            </td>
                            <td className="py-3 px-3 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-red-600 hover:text-red-700"
                                onClick={async () => {
                                  const updated = isS2
                                    ? {
                                        ...tour,
                                        manual_price_2o_semester: null,
                                        visible_prices: setVisiblePriceOverride(tour.visible_prices, SECOND_SEM_MAIN_CELL_KEY, ["alta:adulto"], null),
                                      }
                                    : {
                                        ...tour,
                                        manual_price: null,
                                        visible_prices: setVisiblePriceOverride(tour.visible_prices, FIRST_SEM_MAIN_CELL_KEY, ["alta:adulto"], null),
                                      }
                                  const success = await handleUpdateTour(updated)
                                  if (success) {
                                    setTours((prev) => prev.map((item) => (item.id === tour.id ? updated : item)))
                                    setTours2oSemester((prev) => prev.map((item) => (item.id === tour.id ? updated : item)))
                                  }
                                }}
                              >
                                Limpar
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "tours" && (
          <>
            <Tabs
              value={activeCategory}
              onValueChange={(value) => setActiveCategory(value as Tour["category"])}
              className="mb-8"
            >
              <div className="relative group">
                <TabsList className="flex flex-wrap h-auto gap-1 bg-white shadow-sm rounded-xl p-2 w-full justify-start border border-gray-100">
                  <TabsTrigger value="all" className="text-xs font-medium px-4 py-2 shrink-0 rounded-lg data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:shadow-none">
                    {t("all")} <span className="ml-1 opacity-60">({tours.length})</span>
                  </TabsTrigger>
                  {orderedCategories.map((cat) => (
                    <TabsTrigger key={cat} value={cat} className="text-xs font-medium px-4 py-2 shrink-0 rounded-lg data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
                      {t(cat)} <span className="ml-1 opacity-60">({tourCategoryCounts[cat] ?? 0})</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour, index) => (
                <div key={tour.id} className="admin-card-gsap" style={{ animationDelay: `${index * 100}ms` }}>
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

        {activeTab === "tours-2o-semester" && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Preços Manuais - 2º Semestre</h3>
                <p className="text-sm text-gray-500">
                  Defina valores manuais para o 2º Semestre (vigência após julho). Deixe em branco para usar as tarifas automáticas do BTMS.
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar passeio..."
                  value={searchQuery2o}
                  onChange={(e) => setSearchQuery2o(e.target.value)}
                  className="pl-10 rounded-full bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            {isLoadingTours2o ? (
              <div className="text-center py-12 text-gray-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-green-600" />
                Carregando passeios e tarifas do 2º Semestre...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                      <th className="py-3 px-4">Passeio</th>
                      <th className="py-3 px-4">Preço Atual (1º Sem)</th>
                      <th className="py-3 px-4">Calculado 2º Sem (BTMS)</th>
                      <th className="py-3 px-4 w-72">Valor do Card/Página (BTMS 2º Sem)</th>
                      <th className="py-3 px-4 w-48">Preço Manual 2º Sem</th>
                      <th className="py-3 px-4 text-right font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {tours2oSemester
                      .filter((tour) => tour.title.toLowerCase().includes(searchQuery2o.toLowerCase()))
                      .map((tour) => {
                        const calculated2o = getDisplayPrice({ ...tour, price_2o_semester: null }, 'main_activity', true)
                        const tour1o = tours.find((t) => t.id === tour.id)
                        const currentPrice = tour1o ? getDisplayPrice(tour1o, 'main_activity', false) : 0
                        const secondSemOverride = getVisiblePriceOverride(tour.visible_prices, SECOND_SEM_MAIN_CELL_KEY)
                        const secondSemSelectValue = secondSemOverride ?? "__auto__"
                        const allPriceRows = Array.isArray(tour.prices?.rows) ? tour.prices.rows : []
                        const selectableRows = [
                          ...allPriceRows.filter((row: any) => Number(row?.adulto ?? row?.garupaAdulto) > 0),
                          ...allPriceRows.filter((row: any) => Number(row?.adulto ?? row?.garupaAdulto) <= 0),
                        ]

                        return (
                          <tr key={tour.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {tour.image && (
                                  <img
                                    src={tour.image}
                                    alt={tour.title}
                                    className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                                  />
                                )}
                                <span className="font-semibold text-gray-900">{tour.title}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-500 font-medium">
                              {currentPrice > 0
                                ? currentPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                                : "—"}
                              {tour.manual_price != null && tour.manual_price > 0 && (
                                <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                                  Manual
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-green-700 font-medium">
                              {calculated2o > 0
                                ? calculated2o.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                                : "—"}
                            </td>
                            <td className="py-3 px-4">
                              <Select
                                value={secondSemSelectValue}
                                onValueChange={async (value) => {
                                  const nextVisiblePrices = setVisiblePriceOverride(
                                    tour.visible_prices,
                                    SECOND_SEM_MAIN_CELL_KEY,
                                    value === "__auto__" ? null : value
                                  )
                                  const updated = { ...tour, visible_prices: nextVisiblePrices }
                                  const success = await handleUpdateTour(updated)
                                  if (success) {
                                    setTours2oSemester((prev) => prev.map((item) => (item.id === tour.id ? updated : item)))
                                    setTours((prev) => prev.map((item) => (item.id === tour.id ? updated : item)))
                                  }
                                }}
                              >
                                <SelectTrigger className="h-8 rounded-lg border-gray-200 text-xs">
                                  <SelectValue placeholder="Automático (BTMS)">
                                    {secondSemSelectValue === "__auto__" ? "Automático (BTMS)" : "Valor BTMS selecionado"}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__auto__">Automático (BTMS)</SelectItem>
                                  {selectableRows.map((row: any, index: number) => {
                                    const optionValue = `${row.nomeTabela}#${row.atividade}`
                                    const resolvedValue = Number(row.adulto ?? row.garupaAdulto)
                                    const formattedValue =
                                      resolvedValue > 0
                                        ? resolvedValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                                        : "—"
                                    return (
                                      <SelectItem key={`${optionValue}-${index}`} value={optionValue}>
                                        {`${row.atividade} • ${row.nomeTabela} • ${formattedValue}`}
                                      </SelectItem>
                                    )
                                  })}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3 px-4">
                              <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">R$</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="Automático"
                                  defaultValue={tour.manual_price_2o_semester ?? ""}
                                  onBlur={async (e) => {
                                    const val = e.target.value
                                    const parsed = val === "" ? null : parseFloat(val)
                                    if (parsed !== (tour.manual_price_2o_semester ?? null)) {
                                      const updated = { ...tour, manual_price_2o_semester: parsed }
                                      const success = await handleUpdateTour(updated)
                                      if (success) {
                                        setTours2oSemester(prev => prev.map(t => t.id === tour.id ? updated : t))
                                      }
                                    }
                                  }}
                                  className="pl-8 h-8 rounded-lg text-xs w-36 border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white"
                                />
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              {(tour.manual_price_2o_semester != null || secondSemOverride != null) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={async () => {
                                    const updated = {
                                      ...tour,
                                      manual_price_2o_semester: null,
                                      visible_prices: setVisiblePriceOverride(
                                        tour.visible_prices,
                                        SECOND_SEM_MAIN_CELL_KEY,
                                        null
                                      ),
                                    }
                                    const success = await handleUpdateTour(updated)
                                    if (success) {
                                      setTours2oSemester(prev => prev.map(t => t.id === tour.id ? updated : t))
                                      setTours(prev => prev.map(t => t.id === tour.id ? updated : t))
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                                >
                                  Limpar
                                </Button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    {tours2oSemester.filter((tour) => tour.title.toLowerCase().includes(searchQuery2o.toLowerCase())).length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-400">
                          Nenhum passeio encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
                <div key={attraction.id} className="admin-card-gsap" style={{ animationDelay: `${index * 100}ms` }}>
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
                <div key={pkg.id} className="admin-card-gsap" style={{ animationDelay: `${index * 100}ms` }}>
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
                <div key={post.id} className="admin-card-gsap" style={{ animationDelay: `${index * 100}ms` }}>
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
