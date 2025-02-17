"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/calendar" className={pathname === "/calendar" ? "font-bold" : ""}>
            Calendar
          </Link>
        </li>
        <li className="ml-auto">
          <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
            Sign out
          </Button>
        </li>
      </ul>
    </nav>
  )
}

