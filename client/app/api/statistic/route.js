import { prisma } from "@/app/lib/db"
import { NextResponse } from "next/server"

export async function GET(req) {
  let statistic
  const stats = await getMonthlyProductivity()
  const statsOrders = await getOrdersByStatusAlternative()
  const statsMonth = await getMonthlyOrdersComparison()
  const statsGet = await getMonthlyOperationsStatsOptimized() 
  try {
    const user = await prisma.user.findMany()
    statistic = {
      user: user.length,
      mostProductive: stats.mostProductive,
      leastProductive: stats.leastProductive,
      created: statsOrders.created,
      inTransit: statsOrders.inTransit,
      statsMonth: statsMonth.percentageChange,
      statsGet
    }
    return NextResponse.json(statistic)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}



export async function getMonthlyProductivity() {
  try {
    // Получаем текущую дату и определяем начало/конец месяца
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Получаем всех пользователей с их статистикой за текущий месяц
    const users = await prisma.user.findMany({
      include: {
        stistic: {
          where: {
            date: {
              gte: firstDayOfMonth,
              lte: lastDayOfMonth
            }
          }
        }
      }
    })

    const usersWithStats = users.map(user => {
      const stats = user.stistic
      const totalValue = stats.reduce((sum, stat) => sum + parseFloat(stat.value) || 0, 0)
      const avgValue = stats.length > 0 ? totalValue / stats.length : 0

      return {
        userId: user.id,
        name: user.name,
        login: user.login,
        total: totalValue,
        average: avgValue,
        recordsCount: stats.length
      }
    })

    const sortedByProductivity = [...usersWithStats].sort((a, b) => b.total - a.total)

    const mostProductive = sortedByProductivity[0] || null
    const leastProductive = sortedByProductivity[sortedByProductivity.length - 1] || null

    return {
      mostProductive,
      leastProductive,
      allStats: usersWithStats
    }
  } catch (error) {
    console.error('Error getting monthly productivity:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function getOrdersByStatusAlternative() {
  try {
    const [ready, created, transit] = await Promise.all([
      prisma.orders.count({ where: { status: 'Готов к выдаче' } }),
      prisma.orders.count({ where: { status: 'Создан' } }),
      prisma.orders.count({ where: { status: 'В пути' } })
    ])

    return {
      created: created + ready,
      inTransit: transit,
      total: ready + created + transit
    }
  } catch (error) {
    console.error('Error getting orders status:', error)
    throw error
  }
}


export async function getMonthlyOrdersComparison() {
  try {
    // Получаем текущую дату
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    // Определяем границы текущего месяца
    const firstDayOfCurrentMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0)

    // Определяем границы предыдущего месяца
    const firstDayOfLastMonth = new Date(currentYear, currentMonth - 1, 1)
    const lastDayOfLastMonth = new Date(currentYear, currentMonth, 0)

    // Получаем количество посылок за текущий месяц
    const currentMonthCount = await prisma.orders.count({
      where: {
        dateTime: {
          gte: firstDayOfCurrentMonth,
          lte: lastDayOfCurrentMonth
        }
      }
    })

    // Получаем количество посылок за предыдущий месяц
    const lastMonthCount = await prisma.orders.count({
      where: {
        dateTime: {
          gte: firstDayOfLastMonth,
          lte: lastDayOfLastMonth
        }
      }
    })

    // Рассчитываем процентное изменение
    let percentageChange = 0
    if (lastMonthCount > 0) {
      percentageChange = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100
    } else if (currentMonthCount > 0) {
      percentageChange = 100 // Если в прошлом месяце не было заказов, а в этом есть - рост 100%
    }

    return {
      currentMonth: {
        count: currentMonthCount,
        period: `${currentYear}-${currentMonth + 1}`
      },
      lastMonth: {
        count: lastMonthCount,
        period: `${firstDayOfLastMonth.getFullYear()}-${firstDayOfLastMonth.getMonth() + 1}`
      },
      percentageChange: parseFloat(percentageChange.toFixed(2)), // Округляем до 2 знаков
      status: percentageChange >= 0 ? 'increase' : 'decrease'
    }
  } catch (error) {
    console.error('Error getting monthly orders comparison:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}


export async function getMonthlyOperationsStatsOptimized() {
  try {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const result = await prisma.stistic.groupBy({
      by: ['value'],
      _count: {
        value: true
      },
      where: {
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        },
        value: {
          in: ['1', '2']
        }
      }
    })

    // Преобразуем результат
    const creationCount = result.find(item => item.value === '1')?._count.value || 0
    const sendingCount = result.find(item => item.value === '2')?._count.value || 0

    return {
      creation: creationCount,
      sending: sendingCount,
      total: creationCount + sendingCount,
      month: `${now.getFullYear()}-${now.getMonth() + 1}`
    }
  } catch (error) {
    console.error('Error getting optimized operations stats:', error)
    throw error
  }
}