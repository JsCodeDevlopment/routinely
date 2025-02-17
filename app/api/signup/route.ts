import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    console.log("Received signup request:", { name, email })

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    console.log("User created successfully:", user)

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } })
  } catch (error) {
    console.error("Signup error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: "An error occurred during signup" }, { status: 500 })
  }
}

