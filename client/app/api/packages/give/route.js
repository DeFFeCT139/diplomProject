import { prisma } from "@/app/lib/db";
import axios from "axios";

export async function POST(req) {
    const body = await req.json();
    return saveBD(body)
}

const saveBD = async (body) => {
    console.log(body.list)
    await prisma.packages.updateMany({
        where:{
            id: {
                in: body.list
            }
        },
        data:{
            status: 'Выдан'
        }
    })
    await axios.get('http://localhost:8080/api/get',{
        params:{
            type: 'give',
            id: JSON.stringify(body.list)
        }
    });
    return new Response('Посылка выдана!')
}