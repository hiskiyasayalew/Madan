'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Test() {
  useEffect(() => {
    const run = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')

      console.log('DATA:', data)
      console.log('ERROR:', error)
    }

    run()
  }, [])

  return <div>Testing Supabase...</div>
}