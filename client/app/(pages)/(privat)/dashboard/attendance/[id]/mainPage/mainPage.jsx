'use client'

import { Button, Flex, message, Space, Table, Select, Tour } from 'antd';
import style from '../../css/page.module.css'
import Title from 'antd/es/typography/Title';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useTour } from '@/app/store/store';


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


export default function MainPageAtt({ id }) {
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const setTour = useTour(state => state.setTour)
    const [attendanceValues, setAttendanceValues] = useState({});
    const [modifiedData, setModifiedData] = useState([]);
    const today = new Date().getDate();
    const [open, setOpen] = useState(false);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentDateStr = new Date().toISOString().split('T')[0]; // Формат YYYY-MM-DD

    const givePackajes = async () => {
        const date = new Date
        const { data } = await axios.get('/api/users/attendance', {
            params: {
                month: id,
                year: date.getFullYear()
            }
        })
        const queryData = data.filter(item => item.role !== 'МАNAGER').map(item => {
            return {
                ...item,
                key: item.id,
                role: item.role === 'ADMIN' ? 'Сис. админ' :
                    item.role === 'LOADER' ? 'Грузчик' :
                        item.role === 'CASHIER' ? 'Сотрудник выдачи' : 
                        item.role === 'ACCOUMTANT' ? 'Бухгалтер' : 'HR',
            }
        })
        return queryData;
    }

    const { data, refetch } = useQuery('usersAttendance', givePackajes);

    useEffect(() => {
        setTour(setOpen)
        if (data) {
            setModifiedData([...data]);
            const initialValues = {};
            data.forEach(item => {
                initialValues[item.id] = item[`day${today}`] || "0";
            });
            setAttendanceValues(initialValues);
        }
    }, [data]);

    const handleAttendanceChange = async (userId, value) => {
        const dayKey = `day${today}`;

        setModifiedData(prev => prev.map(item => {
            if (item.id === userId) {
                return {
                    ...item,
                    [dayKey]: value
                };
            }
            return item;
        }));

        setAttendanceValues(prev => ({
            ...prev,
            [userId]: value
        }));

        try {
            const response = await axios.put(`/api/users/attendance/${userId}`, {
                date: currentDateStr,
                value: value
            });

            if (response.status === 200) {
                message.success('Изменения сохранены');
            }
        } catch (error) {
            console.error('Update error:', error);
            message.error('Ошибка при сохранении изменений');
        }
    };

    const columns = [
        {
            title: 'ФИО сотрудника',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Должность',
            dataIndex: 'role',
            key: 'role',
        },
    ];
    const steps = [
        {
            title: 'Страница посещаемости за месяц',
            description: 'Страница посещаемости за месяц, в ней осуществляеться редактирования таблицы посещаемости сотрудников',
            target: null,
        },
        {
            title: 'Обозначения',
            description: 'Расшифровка обозначений в таблице',
            target: () => ref1.current,
        },
        {
            title: 'Обновление данных',
            description: 'Кнопка "Обновить данные", при нажатии на неё данные в таблице обновятся',
            target: () => ref2.current,
        }
    ];

    const getColumns = (baseColumns) => {
        const newColumns = [...baseColumns];
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            if (day === today && currentMonth + 1 === Number(id)) {
                newColumns.push({
                    title: day,
                    key: `day${day}`,
                    render: (record) => (
                        <Select
                            value={record[`day${day}`] || "0"}
                            style={{ width: 60 }}
                            onChange={(value) => handleAttendanceChange(record.id, value)}
                            options={[
                                { value: "0", label: "О" },
                                { value: "1", label: "П" },
                                { value: "2", label: "Б" },
                                { value: "3", label: "В" },
                            ]}
                        />
                    ),
                });
            } else {
                newColumns.push({
                    title: day,
                    dataIndex: `day${day}`,
                    key: `day${day}`,
                    render: (value) => {
                        if (value === "0") return "О";
                        if (value === "1") return "П";
                        if (value === "2") return "Б";
                        if (value === "3") return "В";
                        return value;
                    },
                });
            }
        }
        return newColumns;
    };
    return (
        <div className="">
            <Title level={2}>Посещаемость за {listMonth[id - 1]}</Title>
            <div className={style.block}>
                <Flex style={{ marginBottom: '15px' }} align='center' justify='space-between'>
                    <div className="">
                        <Space ref={ref1}>
                            <div className="">"О" - Отсутствует</div>
                            <div className="">"П" - Присутствует</div>
                            <div className="">"В" - Выходной</div>
                            <div className="">"Б" - Больничный</div>
                        </Space>
                    </div>
                    <Space>
                        {currentMonth + 1 === Number(id) &&
                            <Button
                                ref={ref2}
                                size="large"
                                type="primary"
                                onClick={() => refetch()}
                            >
                                Обновить данные
                            </Button>
                        }
                    </Space>
                </Flex>
                <Table
                    size='small'
                    dataSource={modifiedData}
                    columns={getColumns(columns)}
                    rowKey="id"
                />
            </div>
            <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
        </div>
    );
}