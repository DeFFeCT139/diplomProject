'use client'

import { Button, Flex, Tag, InputNumber, Space, Table, Tour } from 'antd';
import style from './css/page.module.css'
import Title from 'antd/es/typography/Title';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useTour } from '@/app/store/store';

export default function Homed() {

  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const setTour = useTour(state => state.setTour)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState(null);

  const givePackajes = async () => {
    const { data } = await axios.get('/api/orders', {
      params: {
        number: number ? number : null
      }
    })
    const queryData = data.map(item => ({
      ...item,
      status: item.status === 'Отменён' ? <Tag color="red">{item.status}</Tag> : item.status === 'В пути' ? <Tag color="blue">{item.status}</Tag> : <Tag color="green">{item.status}</Tag>,
      key: item.id,
    }))
    return queryData
  }

  const { data, refetch } = useQuery('historyPackajes', givePackajes)

  useEffect(() => {
    setTour(setOpen)
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'idOrders',
      key: 'idOrders',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Куда',
      dataIndex: 'addressIn',
      key: 'addressIn',
    },
    {
      title: 'Откуда',
      dataIndex: 'addressOut',
      key: 'addressOut',
    },
    {
      title: 'Номер получателя',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Номер отправителя',
      dataIndex: 'userOut',
      key: 'userOut',
    }
  ];

  const onSelectChange = newSelectedRowKeys => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const steps = [
    {
      title: 'История посылок',
      description: 'Страница истории посылок, в ней осуществляеться демонстрация всех посылок клиентов',
      target: null,
    },
    {
      title: 'Поиск по номеру телефона',
      description: 'Введите номер телефона получателя и получите одну или несколько посылок',
      target: () => ref1.current,
    },
  ];


  return (
    <div className="">
      <Title level={2}>История посылок</Title>
      <div className={style.block}>
        <Flex style={{ marginBottom: '15px' }} justify='space-between'>
          <Space ref={ref1}>
            <InputNumber onKeyDown={(e) => e.key === 'Enter' && refetch()} size="large" addonBefore="+7" placeholder='9999999999' onChange={(value) => setNumber(value)} />
            <Button onClick={refetch} size="large" variant="solid" color='purple'>Поиск</Button>
          </Space>
        </Flex>
        <Table
          id="myqrcode"
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          dataSource={data}
          columns={columns}
        />
      </div>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  );
}
