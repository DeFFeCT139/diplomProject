import { prisma } from "@/app/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    try {
      const orders = await prisma.orders.findMany()
      return NextResponse.json(orders)
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
      const data = await request.json()
      const newOrders = await prisma.orders.create({
        data: { data }
      })
      return NextResponse.json(newOrders, { status: 201 })
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to create application' },
        { status: 500 }
      )
    }
  }