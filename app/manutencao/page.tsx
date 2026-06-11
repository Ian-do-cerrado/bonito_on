import { AlertTriangle, Map, Clock } from "lucide-react"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8 bg-white p-12 rounded-3xl shadow-lg border border-green-100 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -m-8 w-40 h-40 bg-green-100 rounded-full opacity-50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -m-8 w-40 h-40 bg-blue-100 rounded-full opacity-50 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="mx-auto w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-sm">
            <AlertTriangle className="w-12 h-12" />
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Estamos em Manutenção
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto leading-relaxed mb-8">
            Nossa agência está organizando e atualizando os tarifários e pacotes de passeios para garantir a você as melhores opções com os valores 100% precisos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-lg mx-auto mb-8">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-start gap-3">
              <Map className="w-6 h-6 text-green-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900">Novos Destinos</h3>
                <p className="text-sm text-green-700 mt-1">Estamos atualizando os pacotes de 2026</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
              <Clock className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900">Retorno Rápido</h3>
                <p className="text-sm text-blue-700 mt-1">Voltamos à programação normal em breve</p>
              </div>
            </div>
          </div>

          <p className="text-sm font-medium text-gray-500">
            Agradecemos a compreensão. Nos vemos daqui a pouco!
          </p>
        </div>
      </div>
    </div>
  )
}
