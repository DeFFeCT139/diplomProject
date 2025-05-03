import { prisma } from "@/app/lib/db";

export async function GET(req) {
    const { searchParams } = new URL(req.url)
    let allRaffles = await prisma.packages.findMany();
    if (!allRaffles) {
        return new Response(JSON.stringify([]))
    }
    if (searchParams.get('type') === 'add') {
        let idP = searchParams.get('id')
        allRaffles = await prisma.packages.findMany({
            where: {
                id: Number(idP),
            }
        });
        if (allRaffles.length === 0) return new Response('Такой посылки не существует')
        if (allRaffles[0].status !== 'В пути') return new Response('В доставке такой послыки нет')
        let { id , ...data} = allRaffles[0]
        await prisma.packages.update({
            where: { id: Number(idP) },
            data: {...data, status: 'Готов к выдаче'},
        });
        return new Response(JSON.stringify(allRaffles))
    }
    if (searchParams.get('type') === 'give') {
        const listId = JSON.parse(searchParams.get('id'))
        await prisma.packages.updateMany({
            where:{
                id: {
                    in: listId
                }
            },
            data:{
                status: 'Выдан'
            }
        })
    }
    return new Response(JSON.stringify(allRaffles))
}




