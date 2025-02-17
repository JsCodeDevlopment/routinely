import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
  })

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  return NextResponse.json(event)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()

  const event = await prisma.event.update({
    where: { id: params.id },
    data: body,
  })

  return NextResponse.json(event)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.event.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ message: "Event deleted successfully" })
}

