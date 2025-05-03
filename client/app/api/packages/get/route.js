import { prisma } from "@/app/lib/db";

export async function GET(req) {
    const {searchParams} = new URL(req.url)
    if (searchParams.get('type') === 'give') {
        const packages = await prisma.packages.findMany({
            where:{
                status: 'Готов к выдаче'
            }
        });
        return new Response(JSON.stringify(packages))
    }
    return new Response(JSON.stringify([]))
}

