'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      const user = data.user

      if (user) {
        await supabase.from('users').insert([
          {
            id: user.id,
            email: user.email,
          },
        ])
      }

      alert('Signup successful ✅')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Signup</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleSignup}>Signup</button>
    </div>
  )
}