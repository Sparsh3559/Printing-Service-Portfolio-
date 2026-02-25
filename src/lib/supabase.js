import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://mzkizexagitatacuwwxj.supabase.co"
const supabaseAnonKey = "sb_publishable_HfDjSNYO1FAe6nNleUKeTA_A90g-P8E"

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)