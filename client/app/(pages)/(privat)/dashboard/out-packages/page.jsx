'use client'

import { Button, Flex, Input, InputNumber, Modal, Space, Table, Tag, Tour } from 'antd';
import style from './css/page.module.css'
import Title from 'antd/es/typography/Title';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useTour } from '@/app/store/store';
import { useSession } from 'next-auth/react';

export default function Homed() {

  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const setTour = useTour(state => state.setTour)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [number, setNumber] = useState(null);
  const { data: userData } = useSession();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState({
    code: '',
    list: []
  });
  const [codeReq, setCodeReq] = useState(null);

  useEffect(() => {
    setTour(setOpen)
  }, [])

  const hasSelected = selectedRowKeys.length > 0;

  const givePackajes = async () => {
    const { data } = await axios.get('/api/orders', {
      params: {
        number: number ? number : null
      }
    })
    const queryData = data.filter(item => item.status === 'Готов к выдаче').map(item => ({
      ...item,
      status: <Tag color="green">{item.status}</Tag>,
      key: item.idOrders,
      button: <Button disabled={hasSelected} onClick={() => sendSMS([item.idOrders])} size="large" variant="solid" color='purple'>Выдать</Button>
    }))
    return queryData
  }

  const { data, refetch } = useQuery('outPackajes', givePackajes)

  const columns = [
    {
      title: 'ID',
      dataIndex: 'idOrders',
      key: 'idOrders',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Address In',
      dataIndex: 'addressIn',
      key: 'addressIn',
    },
    {
      title: 'Address Out',
      dataIndex: 'addressOut',
      key: 'addressOut',
    },
    {
      title: 'User In',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: '',
      dataIndex: 'button',
      key: 'button',
      width: 120
    }
  ];

  const steps = [
    {
      title: 'Выдача посылок',
      description: 'Страница выдачи посылок, вы ней осуществляеться выдача посылок клиентам',
      target: null,
    },
    {
      title: 'Поиск по номеру телефона',
      description: 'Введите номер телефона получателя и получите одну или несколько посылок',
      target: () => ref1.current,
    },
    {
      title: 'Выдача посылки',
      description: 'Кнопка "Выдать", при нажатии на неё всплывёт окно с подтверждением выдачи в которое нужн овставить код из СМС',
      target: () => ref2.current,
    }
  ];

  const onSelectChange = newSelectedRowKeys => {
    setSelectedRowKeys(newSelectedRowKeys);
    console.log(newSelectedRowKeys)
  };

  const sendSMS = (data) => {
    setCode({
      code: '111111',
      list: data === 'all' ? selectedRowKeys : data
    })
    setModalOpen(true)
  }

  const onChange = text => {
    setCodeReq(text);
  };

  const givPackages = async () => {
    if (code.code === codeReq) {
      code.list.forEach(async item => {
        await axios.put(`/api/orders/${item}`, {
          status: 3,
          userData
        }).then((response) => {
          if (response.status === 200) {
            refetch()
          }
        })
      })
      setModalOpen(false)
    }
  }

  return (
    <div className="">
      <Title level={2}>Выдача посылок</Title>
      <div className={style.block}>
        <Flex style={{ marginBottom: '15px' }} justify='space-between'>
          <Space ref={ref1}>
            <InputNumber onKeyDown={(e) => e.key === 'Enter' && refetch()} size="large" addonBefore="+7" placeholder='9999999999' onChange={(value) => setNumber(value)} />
            <Button onClick={refetch} size="large" variant="solid" color='purple'>Поиск</Button>
          </Space>
          <Space>
            <Button ref={ref2} disabled={!hasSelected} onClick={() => sendSMS('all')} size="large" variant="solid" color='purple'>Выдать</Button>
          </Space>
        </Flex>
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          dataSource={data}
          columns={columns}
        />
      </div>
      <Modal
        title="Введите код из СМС"
        centered
        open={modalOpen}
        onOk={givPackages}
        onCancel={() => setModalOpen(false)}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '30px 0px' }}>
          <Input.OTP formatter={str => str.toUpperCase()} {...{ onChange }} />
        </div>
      </Modal>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  );
}
