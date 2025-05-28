import { hashPassword } from "@/app/lib/auth"
import { prisma } from "@/app/lib/db"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    const user = await prisma.user.findMany()
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

// POST создать новую заявку
export async function POST(request) {
  try {
    const {password, ...data} = await request.json()
    const newUser = await prisma.user.create({
      data: {password: await hashPassword(password), ...data}
    })
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}