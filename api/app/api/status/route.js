import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const statuses = await prisma.statuses.findMany()
        return NextResponse.json(statuses)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch applications' },
            { status: 500 }
        )
    }
}



