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
    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        date: true,
      },
      distinct: ["date"],
    })

    const noteDates = notes.map((note) => note.date.toISOString().split("T")[0])

    return NextResponse.json(noteDates)
  } catch (error) {
    console.error("Error fetching note dates:", error)
    return NextResponse.json({ error: "Failed to fetch note dates" }, { status: 500 })
  }
}

