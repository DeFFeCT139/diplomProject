import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

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

export async function POST(request) {
    try {
      const {status, userOut, user, ...data} = await request.json()
      const statusData = await prisma.statuses.findUnique({
        where:{
            id: status
        }
      })
      console.log({userOut: String(userOut), user: String(user), ...data, dateTime: (new Date()), status: statusData.name})
      const newOrders = await prisma.orders.create({
        data: {userOut: String(userOut), user: String(user), ...data, dateTime: (new Date()), status: statusData.name}
      })
      console.log(newOrders)
      return NextResponse.json(newOrders, { status: 201 })
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { error: 'Failed to create application' },
        { status: 500 }
      )
    }
  }



