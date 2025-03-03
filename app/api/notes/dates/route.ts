import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const notes = await prisma.note.groupBy({
      by: ["date"],
      where: {
        userId: session.user.id,
      },
      _count: {
        id: true,
      },
    })

    const noteDates = notes.map((note) => ({
      date: note.date.toISOString().split("T")[0],
      count: note._count.id,
    }))

    return NextResponse.json(noteDates)
  } catch (error) {
    console.error("Error fetching note dates:", error)
    return NextResponse.json({ error: "Failed to fetch note dates" }, { status: 500 })
  }
}

