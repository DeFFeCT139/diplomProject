import { prisma } from "@/app/lib/db"
import { NextResponse } from "next/server"

export async function GET(req) {
  let statistic
  try {
    const stats = await getAllUsersOperationsStats()
    statistic = stats.usersStats
    return NextResponse.json(statistic)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}



export async function getAllUsersOperationsStats() {
  try {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    // Границы текущего месяца
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()

    // Получаем всех пользователей с их статистикой за месяц
    const usersWithStats = await prisma.user.findMany({
      include: {
        stistic: {
          where: {
            date: {
              gte: firstDayOfMonth,
              lte: lastDayOfMonth
            },
            value: {
              in: ['1', '2']
            }
          }
        }
      }
    })

    // Формируем результат для каждого пользователя
    const result = usersWithStats.map(user => {
      // Группируем статистику по дням
      const groupedByDay = user.stistic.reduce((acc, stat) => {
        const date = new Date(stat.date)
        const day = date.getDate()
        const key = `${date.getFullYear()}-${date.getMonth() + 1}-${day}`
        
        if (!acc[key]) {
          acc[key] = { creation: 0, sending: 0 }
        }
        
        if (stat.value === '1') acc[key].creation++
        if (stat.value === '2') acc[key].sending++
        
        return acc
      }, {})

      // Создаем полный массив дней месяца
      const fullMonthData = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1
        const date = new Date(currentYear, currentMonth, day)
        const key = `${date.getFullYear()}-${date.getMonth() + 1}-${day}`
        
        return {
          date: date.toISOString().split('T')[0],
          creation: groupedByDay[key]?.creation || 0,
          sending: groupedByDay[key]?.sending || 0
        }
      })

      // Форматируем для графика
      const formatForChart = (data) => 
        data.map(day => ({
          letter: day.date.split('-')[2].padStart(2, '0'),
          frequency: day.creation + day.sending
        }))

      return {
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        userLogin: user.login,
        creationStats: formatForChart(fullMonthData),
        total: {
          creation: user.stistic.filter(s => s.value === '1').length,
          sending: user.stistic.filter(s => s.value === '2').length
        }
      }
    })

    return {
      month: `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`,
      usersStats: result
    }
  } catch (error) {
    console.error('Error getting users stats:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}