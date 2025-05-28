import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

export const prisma = new PrismaClient();

async function main() {
    const data = {
        login: 'admin',
        password: await bcrypt.hash('12345', 12),
        role: 'ADMIN'
    }
    const user = await prisma.user.findMany();
    if (user.length === 0) {
        user = await prisma.user.create({
            data: data,
        });
    }
    console.log(user)
    await prisma.attendance.create({
        data: {
            userId: user[0].id,
            date: new Date(),
            value: "0"
        }
    });
}

main()


