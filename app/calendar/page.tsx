import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import CalendarContent from "./calendar-content"

export default async function CalendarPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <CalendarContent />
}

