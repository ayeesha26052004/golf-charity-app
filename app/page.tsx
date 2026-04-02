import { supabase } from '@/lib/supabaseClient'

export default async function Home() {
  const { data, error } = await supabase.from('users').select('*')

  console.log(data, error)

  return (
    <div style={{ padding: "20px" }}>
      <h1>Supabase Connected ✅</h1>
    </div>
  )
}
