import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")

  if (!date) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
  }

  const events = await prisma.event.findMany({
    where: {
      date: new Date(date),
      // Add user filtering here once authentication is implemented
    },
  })

  return NextResponse.json(events)
}

export async function POST(request: Request) {
  const body = await request.json()

  const event = await prisma.event.create({
    data: {
      ...body,
      // Add user association here once authentication is implemented
    },
  })

  return NextResponse.json(event)
}

