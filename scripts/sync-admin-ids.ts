import { createClient } from "@supabase/supabase-js"
import { config } from "dotenv"
import { resolve } from "path"

// Carregar variáveis de ambiente do .env.local
config({ path: resolve(process.cwd(), ".env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase URL or Service Role Key is missing.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function syncAdminIds() {
  console.log("Iniciando a sincronização de IDs de administradores...")

  // 1. Obter todos os usuários da tabela admin_users
  const { data: adminUsers, error: adminError } = await supabase.from("admin_users").select("id, email")

  if (adminError) {
    console.error("Erro ao buscar administradores:", adminError.message)
    return
  }

  if (!adminUsers || adminUsers.length === 0) {
    console.log("Nenhum administrador encontrado para sincronizar.")
    return
  }

  console.log(`Encontrados ${adminUsers.length} administradores para verificar.`)

  let updatedCount = 0
  let errorCount = 0

  // 2. Iterar sobre cada admin e sincronizar o ID
  for (const admin of adminUsers) {
    console.log(`\nVerificando admin: ${admin.email}`)

    // 3. Obter o usuário correspondente da autenticação do Supabase pelo email
    // 3. Obter o usuário correspondente da autenticação do Supabase pelo email
    const { data: { users: authUsers }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.error(`  -> Erro ao listar usuários de autenticação:`, listError.message)
      errorCount++
      continue
    }

    const authUser = authUsers.find(u => u.email === admin.email)

    if (!authUser) {
      console.warn(`  -> Usuário de autenticação não encontrado para ${admin.email}. Pulando.`)
      continue
    }

    const correctId = authUser.id

    // 4. Verificar se o ID na tabela admin_users já está correto
    if (admin.id === correctId) {
      console.log(`  -> ID para ${admin.email} já está correto.`)
    } else {
      console.log(`  -> ID incorreto encontrado para ${admin.email}. ID atual: ${admin.id}, ID correto: ${correctId}.`)
      // 5. Atualizar o ID na tabela admin_users
      const { error: updateError } = await supabase
        .from("admin_users")
        .update({ id: correctId })
        .eq("email", admin.email)

      if (updateError) {
        console.error(`  -> Falha ao atualizar o ID para ${admin.email}:`, updateError.message)
        errorCount++
      } else {
        console.log(`  -> ID para ${admin.email} atualizado com sucesso!`)
        updatedCount++
      }
    }
  }

  console.log("\n--- Sincronização Concluída ---")
  console.log(`Administradores atualizados: ${updatedCount}`)
  console.log(`Erros encontrados: ${errorCount}`)
  console.log("---------------------------------")
}

syncAdminIds()