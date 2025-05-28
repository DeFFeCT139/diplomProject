import { prisma } from "./db"

export const AddStat = async(req, value) => {
    const { userData, ...reqData } = req
    await prisma.stistic.create({
        data: {
            value: value,
            userId: userData.user.id,
        }
    })
}