'use client'

import { useState } from 'react'
import { signUpUser } from '../../lib/signup'

export default function TestSignup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = async () => {
    console.log("BUTTON CLICKED")
    await signUpUser({
      email,
      password,
      username: 'testuser',
      fullName: 'Test User',
      phone: '123456789',
    })
  }

  return (
    <div className="text-white">
      <input
        placeholder="email"
        className="bg-black text-white border p-2"
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <input
        placeholder="password"
        className="bg-black text-white border p-2 ml-2"
        onChange={(e) => setPassword(e.target.value)}
      />
            <button
            onClick={handleSignup}
            className="bg-black text-white p-2 ml-2"
            >
            SIGN UP
            </button>
    </div>
  )
}