'use client'

import { Table, Tour } from 'antd';
import style from './css/page.module.css'
import Title from 'antd/es/typography/Title';
import { useQuery } from 'react-query';
import axios from 'axios';
import Link from 'next/link';
import { useTour } from '@/app/store/store';
import { useEffect, useRef, useState } from 'react';

export default function Homed() {


  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const setTour = useTour(state => state.setTour)
  const [open, setOpen] = useState(false);
  const givePackajes = async () => {
    const { data } = await axios.get('/api/users/attendance', {
      params: {
        attendance: '1'
      }
    })
    const queryData = data.map(item => ({
      ...item,
      key: data.indexOf(item),
      name: <Link href={`attendance/${item.month}`}>{item.name}</Link>
    }))
    return queryData
  }

  const { data, refetch } = useQuery('addPackajes', givePackajes)

  useEffect(() => {
    setTour(setOpen)
  }, [])


  const columns = [
    {
      title: 'Название Месяца',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  const steps = [
    {
      title: 'Посещаемость',
      description: 'Страница посещаемость, в данной странице отображается история посещаемости по месяцам',
      target: null,
    }
  ];


  return (
    <div className="">
      <Title level={2}>Посещаемость</Title>
      <div className={style.block}>
        <Table
          dataSource={data}
          columns={columns}
        />
      </div>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  );
}
