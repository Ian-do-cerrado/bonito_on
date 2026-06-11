import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supaKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
// or use service role
const supabase = createClient(supaUrl, supaKey)

async function test() {
  const { data, error } = await supabase.from('tours').select('*')
  if (error) console.error('Error fetching tours:', error)
  else console.log('Fetched tours count:', data.length)
}

test()
