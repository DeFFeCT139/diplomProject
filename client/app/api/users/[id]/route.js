import { prisma } from "@/app/lib/db";
import axios from "axios";
import { NextResponse } from "next/server";



export async function DELETE(request, { params }) {
  try {
    const {id} = await params
    await prisma.user.delete({where: { id: id },})
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


