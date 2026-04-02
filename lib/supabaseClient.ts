import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kinaqxwcxkxmznrrcrov.supabase.co'
const supabaseKey = 'sb_publishable_MzFQYiuzAay2-jWx640ugw_UsARDA8g'

export const supabase = createClient(supabaseUrl, supabaseKey)