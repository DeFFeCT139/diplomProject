const { Role } = require('@prisma/client');
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    const rolesArray = Object.values(Role);
    return NextResponse.json(rolesArray)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
