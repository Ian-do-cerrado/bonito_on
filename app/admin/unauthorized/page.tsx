import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Acesso Negado</CardTitle>
            <p className="text-sm text-gray-600 mt-2">Você não tem permissão para acessar esta área</p>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-gray-700">Esta área é restrita apenas para administradores autorizados.</p>
              <p className="text-sm text-gray-500">
                Se você acredita que isso é um erro, entre em contato com o suporte.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/admin/login" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Fazer Login
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Home className="w-4 h-4 mr-2" />
                  Ir para Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
