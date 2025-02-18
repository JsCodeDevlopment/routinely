import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { NoteStatusEnum } from "@/components/day-notes"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const dateParam = searchParams.get("date")

  if (!dateParam) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
  }

  const date = new Date(dateParam)
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)

  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      orderBy: {
        time: "asc",
      },
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Error fetching notes:", error)
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { date, time, content, status } = body

  try {
    const note = await prisma.note.create({
      data: {
        date: new Date(date),
        time,
        content,
        status: status || NoteStatusEnum.pending,
        userId: session.user.id,
      },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error("Error creating note:", error)
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
  }
}

