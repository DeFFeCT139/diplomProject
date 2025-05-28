import { prisma } from "@/app/lib/db"
import { NextResponse } from "next/server"


function getUniqueMonths(data) {
  const months = new Set();
  const listMonth = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ]
  
  data.forEach(item => {
    const date = new Date(item.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // +1 т.к. месяцы 0-11
    months.add(monthKey);
  });
  
  return Array.from(months).map(key => {
    const [year, month] = key.split('-');
    return { name: listMonth[month - 1], month: Number(month), year: key};
  });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  try {
    // Обработка запроса уникальных месяцев
    if (searchParams.get('attendance')) {
      const attendance = await prisma.attendance.findMany();
      return NextResponse.json(getUniqueMonths(attendance));
    }

    // Получаем месяц и год из параметров запроса
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    
    // Если месяц и год не указаны, используем текущую дату
    const targetDate = new Date();
    if (month && year) {
      targetDate.setFullYear(parseInt(year), parseInt(month) - 1, 1);
    }
    targetDate.setHours(0, 0, 0, 0);

    const users = await prisma.user.findMany({
      include: {
        attendance: {
          where: {
            date: {
              gte: new Date(targetDate.getFullYear(), targetDate.getMonth(), 1),
              lt: new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1)
            }
          },
          orderBy: {
            date: 'asc'
          }
        }
      }
    });

    const result = users.map(user => {
      const daysData = {};
      const daysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();

      for (let i = 1; i <= daysInMonth; i++) {
        const dayKey = `day${i}`;
        const attendanceRecord = user.attendance.find(record => {
          const recordDate = new Date(record.date);
          return recordDate.getDate() === i;
        });

        const dateToCheck = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          i
        );

        if (dateToCheck > new Date()) { // Будущие даты
          daysData[dayKey] = "";
        } else if (attendanceRecord) {
          daysData[dayKey] = attendanceRecord.value;
        } else {
          daysData[dayKey] = "0";
        }
      }

      return {
        id: user.id,
        login: user.login,
        name: user.name,
        role: user.role,
        ...daysData
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance data' },
      { status: 500 }
    );
  }
}