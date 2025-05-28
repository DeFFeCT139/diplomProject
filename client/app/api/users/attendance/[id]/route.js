import { prisma } from '@/app/lib/db';
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
        const { date, value } = await request.json()
        const { id } = await params
        const existing = await prisma.attendance.findFirst({
            where: {
                userId: id,
                date: new Date(date)
            }
        });

        let result;
        if (existing) {
            result = await prisma.attendance.update({
                where: { id: existing.id },
                data: { value }
            });
        } else {
            result = await prisma.attendance.create({
                data: {
                    userId: id,
                    date: new Date(date),
                    value
                }
            });
        }
        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update orders', details: error.message },
            { status: 500 }
        )
    }
}