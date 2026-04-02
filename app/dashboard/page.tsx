'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [score, setScore] = useState('')
  const [scores, setScores] = useState<any[]>([])
  const [winners, setWinners] = useState<any[]>([])

  useEffect(() => {
    getUser()
    fetchWinners()
  }, [])

  const getUser = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)

    if (data.user) {
      fetchScores(data.user.id)
    }
  }

  const fetchScores = async (userId: string) => {
    const { data } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    setScores(data || [])
  }

  const fetchWinners = async () => {
    const { data } = await supabase
      .from('winners')
      .select('*')
      .order('created_at', { ascending: false })

    setWinners(data || [])
  }

  const addScore = async () => {
    if (!user) return

    const numericScore = parseInt(score)

    if (numericScore < 1 || numericScore > 45) {
      alert('Score must be between 1 and 45')
      return
    }

    // Keep only last 5 scores
    if (scores.length >= 5) {
      const oldest = scores[scores.length - 1]
      await supabase.from('scores').delete().eq('id', oldest.id)
    }

    await supabase.from('scores').insert([
      {
        user_id: user.id,
        score: numericScore,
      },
    ])

    setScore('')
    fetchScores(user.id)
  }

  // 🎯 DRAW FUNCTION
  const runDraw = async () => {
    console.log("RUN DRAW CLICKED")

    const drawNumbers = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 45) + 1
    )

    console.log('Draw Numbers:', drawNumbers)

    const { data: drawData } = await supabase
      .from('draws')
      .insert([{ numbers: drawNumbers }])
      .select()

    const drawId = drawData?.[0]?.id

    const { data: users } = await supabase.from('users').select('*')

    for (const u of users || []) {
      const { data: scores } = await supabase
        .from('scores')
        .select('score')
        .eq('user_id', u.id)

      const userScores = scores?.map((s) => s.score) || []

      const matches = userScores.filter((s) =>
        drawNumbers.includes(s)
      ).length

      console.log('User:', u.email)
      console.log('User Scores:', userScores)
      console.log('Matches:', matches)

      // TEMP: change to >=1 for testing, then back to >=3
      if (matches >= 1) {
        await supabase.from('winners').insert([
          {
            user_id: u.id,
            draw_id: drawId,
            match_count: matches,
            prize: matches * 100,
          },
        ])
      }
    }

    alert('Draw completed 🎯')
    fetchWinners()
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard 🎯</h1>

      {user && <p>Welcome: {user.email}</p>}

      <hr />

      {/* SCORE SECTION */}
      <h2>Add Score</h2>

      <input
        type="number"
        placeholder="Enter score (1-45)"
        value={score}
        onChange={(e) => setScore(e.target.value)}
      />
      <button onClick={addScore}>Add</button>

      <h3>Your Scores</h3>

      <ul>
        {scores.map((s) => (
          <li key={s.id}>
            {s.score} ({new Date(s.created_at).toLocaleString()})
          </li>
        ))}
      </ul>

      <hr />

      {/* DRAW SECTION */}
      <h2>Run Draw</h2>
      <button onClick={runDraw}>Run Draw</button>

      <hr />

      {/* WINNERS SECTION */}
      <h2>🏆 Winners</h2>

      <ul>
        {winners.map((w) => (
          <li key={w.id}>
            Match: {w.match_count} | Prize: ₹{w.prize}
          </li>
        ))}
      </ul>
    </div>
  )
}