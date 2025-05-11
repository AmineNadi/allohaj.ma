'use client'

import { signOut } from "next-auth/react"

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
    >
      تسجيل الخروج ⬅️ 
    </button>
  )
}
