import { prisma } from "@/app/lib/db"
import { NextResponse } from "next/server"

export async function GET(req) {
  let statistic
  try {
    const stats = await getOperationsStatsWithAllDays()
    statistic = {
      stats
    }
    console.log(statistic.stats.currentMonthCreation)
    return NextResponse.json(statistic)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}


export async function getOperationsStatsWithAllDays() {
  try {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    // Границы текущего месяца
    const firstDayOfCurrentMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0)
    const daysInCurrentMonth = lastDayOfCurrentMonth.getDate()

    // Границы предыдущего месяца
    const firstDayOfLastMonth = new Date(currentYear, currentMonth - 1, 1)
    const lastDayOfLastMonth = new Date(currentYear, currentMonth, 0)
    const daysInLastMonth = lastDayOfLastMonth.getDate()

    // Получаем все записи за текущий месяц
    const currentMonthRecords = await prisma.stistic.findMany({
      where: {
        date: {
          gte: firstDayOfCurrentMonth,
          lte: lastDayOfCurrentMonth
        },
        value: {
          in: ['1', '2']
        }
      }
    })

    // Получаем все записи за предыдущий месяц
    const lastMonthRecords = await prisma.stistic.findMany({
      where: {
        date: {
          gte: firstDayOfLastMonth,
          lte: lastDayOfLastMonth
        },
        value: {
          in: ['1', '2']
        }
      }
    })

    // Функция для группировки по дням
    const groupByDay = (records) => {
      const grouped = {}
      
      records.forEach(record => {
        const date = new Date(record.date)
        const day = date.getDate()
        const key = `${date.getFullYear()}-${date.getMonth() + 1}-${day}`
        
        if (!grouped[key]) {
          grouped[key] = {
            creation: 0,
            sending: 0
          }
        }
        
        if (record.value === '1') {
          grouped[key].creation++
        } else if (record.value === '2') {
          grouped[key].sending++
        }
      })
      
      return grouped
    }

    // Группируем данные
    const currentMonthGrouped = groupByDay(currentMonthRecords)
    const lastMonthGrouped = groupByDay(lastMonthRecords)

    // Функция для создания массива со всеми днями месяца
    const createFullMonthArray = (groupedData, daysInMonth, monthDate) => {
      return Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day)
        const key = `${date.getFullYear()}-${date.getMonth() + 1}-${day}`
        
        return {
          date: date.toISOString().split('T')[0],
          creation: groupedData[key]?.creation || 0,
          sending: groupedData[key]?.sending || 0
        }
      })
    }

    // Создаем полные массивы для каждого месяца
    const currentMonthData = createFullMonthArray(
      currentMonthGrouped,
      daysInCurrentMonth,
      firstDayOfCurrentMonth
    )

    const lastMonthData = createFullMonthArray(
      lastMonthGrouped,
      daysInLastMonth,
      firstDayOfLastMonth
    )

    // Форматируем данные в требуемый вид для каждого типа операции
    const formatForChart = (data, type) => {
      return data.map(day => ({
        letter: day.date.split('-')[2].padStart(2, '0'), // День с ведущим нулем
        frequency: type === 'creation' ? day.creation : day.sending
      }))
    }

    return {
      currentMonthCreation: formatForChart(currentMonthData, 'creation'),
      currentMonthSending: formatForChart(currentMonthData, 'sending'),
      lastMonthCreation: formatForChart(lastMonthData, 'creation'),
      lastMonthSending: formatForChart(lastMonthData, 'sending'),
      meta: {
        currentMonth: `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`,
        lastMonth: `${firstDayOfLastMonth.getFullYear()}-${(firstDayOfLastMonth.getMonth() + 1).toString().padStart(2, '0')}`
      }
    }
  } catch (error) {
    console.error('Error getting operations stats:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}