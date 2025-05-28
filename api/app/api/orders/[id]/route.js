import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = await params
  try {
    const orders = await prisma.orders.findUnique({
      where: { id: Number(id) }
    })

    if (!orders) {
      return NextResponse.json(
        { error: 'Orders not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const {status} = await request.json()
    const {id} = await params

    if (status) {
      const statuses = await prisma.statuses.findUnique({
        where:{
          id: status
        }
      })
      const updatedDetail = await prisma.orders.update({
        where: { id: Number(id) },
        data: {
          status: statuses.name
        }
      })
      return NextResponse.json(updatedDetail)
    }

    const updatedDetail = await prisma.orders.update({
      where: { id: Number(id) },
      data: body
    })

    return NextResponse.json(updatedDetail)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update orders', details: error.message },
      { status: 500 }
    )
  }
}



