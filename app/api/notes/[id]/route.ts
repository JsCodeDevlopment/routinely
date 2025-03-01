import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { content } = body

  const note = await prisma.note.updateMany({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    data: { content },
  })

  if (note.count === 0) {
    return NextResponse.json({ error: "Note not found or unauthorized" }, { status: 404 })
  }

  return NextResponse.json({ message: "Note updated successfully" })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const note = await prisma.note.deleteMany({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (note.count === 0) {
    return NextResponse.json({ error: "Note not found or unauthorized" }, { status: 404 })
  }

  return NextResponse.json({ message: "Note deleted successfully" })
}

