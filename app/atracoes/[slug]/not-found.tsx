import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search } from "lucide-react"

export default function AttractionNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <Search className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Atração não encontrada</h1>
          <p className="text-gray-600">A atração que você está procurando não existe ou foi removida.</p>
        </div>

        <div className="space-y-4">
          <Link href="/#attractions">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ver todas as atrações
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline" className="w-full">
              Voltar ao início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
