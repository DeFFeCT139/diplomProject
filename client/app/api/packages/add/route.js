import { prisma } from "@/app/lib/db";
import axios from "axios";

export async function POST(req) {
    const body = await req.json();
    return saveBD(body)
}

const saveBD = async (body) => {
    let allRaffles = await prisma.packages.findMany({
        where: {
            idPackages: Number(body.idPackages),
        }
    })
    if (allRaffles.length !== 0) return new Response('Тавар уже принят')
    const infocard = await axios.get('http://localhost:8080/api/get',{
        params:{
            type: 'add',
            id: body.idPackages
        }
    });
    if (!Array.isArray(infocard.data)) return new Response(infocard.data)
    let data = {...infocard.data[0], idPackages: body.idPackages}
    await prisma.packages.create({
        data: {
            ...data,
            status: 'Готов к выдаче'
        }
    })
    return new Response('Тавар создан!')
}