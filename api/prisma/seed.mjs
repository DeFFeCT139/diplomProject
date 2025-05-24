import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

async function main() {
    const data = [
        { name: "В пути" },
        { name: "Готов к выдаче" },
        { name: "Выдан" },
        { name: "Созадан" },
    ]
    const Statuses = await prisma.statuses.findMany();
    if (Statuses.length === 0) {
        await prisma.statuses.createMany({
            data: data,
        });
    }
}

main()


