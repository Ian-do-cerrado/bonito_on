const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://inknnuxctfwnoswawixt.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlua25udXhjdGZ3bm9zd2F3aXh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODkwMTUzMCwiZXhwIjoyMDY0NDc3NTMwfQ.NkOBzQKLZtR8FfvLjBzY_j3P30kKUBm2mXtd0ywN1Rw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdminSettings() {
  console.log("--- CONFIGURANDO ADMIN SETTINGS ---");
  
  // Tentar criar a tabela via RPC SQL se disponível, ou apenas verificar se existe.
  // Como não temos acesso direto ao painel SQL, vamos tentar criar uma tabela de forma indireta ou usar o que temos.
  // Na verdade, a melhor forma em Supabase sem SQL Editor é usar uma tabela que já existe ou criar uma nova via migrations.
  // Mas aqui vamos tentar usar a tabela 'admin_users' que já existe para guardar configurações globais se necessário,
  // ou tentar criar a tabela via rpc se configurado.
  
  // Como alternativa, vamos usar uma tabela 'admin_settings' e ver se conseguimos dar um 'insert' que cria a estrutura se o Supabase permitir (Schema Auto-detect).
  // Nota: O Supabase não cria tabelas via INSERT se elas não existirem.
  
  // Vamos tentar verificar se conseguimos criar a tabela:
  const { error: createError } = await supabase.rpc('exec_sql', { 
    sql: `
      CREATE TABLE IF NOT EXISTS admin_settings (
        key TEXT PRIMARY KEY,
        value JSONB,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      INSERT INTO admin_settings (key, value) VALUES ('last_prices_sync_at', '\"\"'::jsonb) ON CONFLICT (key) DO NOTHING;
    `
  });

  if (createError) {
    console.error("Erro ao criar tabela (provavelmente sem permissão de rpc 'exec_sql'):", createError.message);
    console.log("Tentando alternativa: buscar se existe e se não, avisar.");
  } else {
    console.log("Tabela admin_settings criada/verificada com sucesso!");
  }
}

setupAdminSettings();
