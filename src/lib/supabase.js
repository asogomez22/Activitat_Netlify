import { createClient } from '@supabase/supabase-js'

const normalizeEnvValue = (value) => value?.trim().replace(/;+$/, '') ?? ''

const supabaseUrl = normalizeEnvValue(import.meta.env.VITE_SUPABASE_URL)
const supabaseAnonKey = normalizeEnvValue(import.meta.env.VITE_SUPABASE_ANON_KEY)

export const supabaseConfigError =
  !supabaseUrl || !supabaseAnonKey
    ? 'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el archivo .env.'
    : null

export const supabase = supabaseConfigError
  ? null
  : createClient(supabaseUrl, supabaseAnonKey)
