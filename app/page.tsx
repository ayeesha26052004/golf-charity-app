'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser()

    if (data.user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  return <p>Loading...</p>
}