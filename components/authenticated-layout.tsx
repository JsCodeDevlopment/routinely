"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { Sidebar } from "@/components/sidebar"

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    )
  }

  return <>{children}</>
}

