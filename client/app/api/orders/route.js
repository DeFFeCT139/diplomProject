import { AddStat } from "@/app/lib/addStatistic"
import { prisma } from "@/app/lib/db"
import axios from "axios"
import { NextResponse } from "next/server"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  try {
    const orders = await prisma.orders.findMany()
    if (searchParams.get('number')) {
      const number = searchParams.get('number')
      if (searchParams.get('type')) {
        return NextResponse.json(orders.filter(item => item.userOut.includes(number)))
      }
      return NextResponse.json(orders.filter(item => item.user.includes(number)))
    }

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
    const req = await request.json()
    const { userData, ...reqData } = req
    await AddStat(req, '1')
    if (!req.idOrders) {
      const { data } = await axios.post(`http://localhost:8080/api/orders/`, { ...reqData, status: 4 })
      const { id, ...order } = data
      const newOrders = await prisma.orders.create({
        data: { idOrders: id, ...order }
      })
      return NextResponse.json(newOrders, { status: 201 })
    }
    await axios.put(`http://localhost:8080/api/orders/${reqData.idOrders}`, { status: 2 })
    const { data } = await axios.get(`http://localhost:8080/api/orders/${reqData.idOrders}`)
    const { id, ...order } = data
    const newOrders = await prisma.orders.create({
      data: { idOrders: id, ...order }
    })
    return NextResponse.json(newOrders, { status: 201 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}