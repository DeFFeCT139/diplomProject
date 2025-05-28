import { AddStat } from "@/app/lib/addStatistic";
import { prisma } from "@/app/lib/db";
import axios from "axios";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const { status, userData, } = await request.json()
    const { id } = await params
    await AddStat({userData}, '2')
    if (status) {
      const { data } = await axios.get(`http://localhost:8080/api/status/${status}`)
      await axios.put(`http://localhost:8080/api/orders/${id}`, { status: status })
      const updatedDetail = await prisma.orders.update({
        where: { idOrders: Number(id) },
        data: {
          status: data.name
        }
      })
      return NextResponse.json(updatedDetail)
    }
    return NextResponse.json(updatedDetail)
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to update orders', details: error.message },
      { status: 500 }
    )
  }
}



export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const { data } = await axios.put(`http://localhost:8080/api/orders/${id}`, { status: 5 })
    await prisma.orders.update({
      where: { idOrders: Number(id) },
      data: {
        status: data.status
      }
    })
    return NextResponse.json(
      { message: 'Detail deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete detail', details: error.message },
      { status: 500 }
    )
  }
}


