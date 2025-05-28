import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = await params
  try {
    const status = await prisma.statuses.findUnique({
      where: { id: Number(id) }
    })

    if (!status) {
      return NextResponse.json(
        { error: 'Status not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(status)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Status', details: error.message },
      { status: 500 }
    )
  }
}



