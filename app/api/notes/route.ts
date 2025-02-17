import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")
  const start = searchParams.get("start")
  const end = searchParams.get("end")

  let notes

  if (date) {
    notes = await prisma.note.findMany({
      where: {
        date: new Date(date),
        userId: session.user.id,
      },
    })
  } else if (start && end) {
    notes = await prisma.note.findMany({
      where: {
        date: {
          gte: new Date(start),
          lte: new Date(end),
        },
        userId: session.user.id,
      },
    })
  } else {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 })
  }

  return NextResponse.json(notes)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { date, time, content } = body

  const note = await prisma.note.create({
    data: {
      date: new Date(date),
      time,
      content,
      userId: session.user.id,
    },
  })

  return NextResponse.json(note)
}

