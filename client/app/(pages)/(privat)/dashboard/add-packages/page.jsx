'use client'

import { Button, Flex, Form, Input, InputNumber, Modal, QRCode, Tour, Space, Table, Tag } from 'antd';
import style from './css/page.module.css'
import Title from 'antd/es/typography/Title';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useTour } from '@/app/store/store';
import { useSession } from 'next-auth/react';



function doDownload(url, fileName) {
  const a = document.createElement('a');
  a.download = fileName;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const downloadCanvasQRCode = (id) => {
  var _a;
  const canvas =
    (_a = document.getElementById(id)) === null || _a === void 0
      ? void 0
      : _a.querySelector('canvas');
  if (canvas) {
    const url = canvas.toDataURL();
    doDownload(url, 'QRCode.png');
  }
};



export default function Homed() {

  
  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const setTour = useTour(state => state.setTour)
  const { data: userData } = useSession();
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setTour(setOpen)
  }, [])

  const givePackajes = async () => {
    const { data } = await axios.get('/api/orders', {
      params: {
        number: number ? number : null,
        type: 'out'
      }
    })
    const queryData = data.filter(item => item.status === 'Создан').map(item => ({
      ...item,
      status: <Tag color="green">{item.status}</Tag>,
      key: item.id,
      qr: <div className={style.qr} id={`myqrcode${item.idOrders}`}>
        <QRCode
          style={{ display: 'none' }}
          type={'canvas'}
          value={JSON.stringify({
            id: item.idOrders,
            code: 'pochta'
          })}
          bgColor="#fff"
        />
        <Button onClick={() => downloadCanvasQRCode(`myqrcode${item.idOrders}`)} size="large" variant="solid" color='purple'>Cкачать QR</Button>
      </div>,
      button: <Button onClick={() => deleteOrder(item.idOrders)} size="large" variant="solid" color='purple'>Отменить</Button>
    }))
    return queryData
  }

  const { data, refetch } = useQuery('addPackajes', givePackajes)


  const deleteOrder = async (id) => {
    await axios.delete(`/api/orders/${id}`, { status: 5 })
    refetch()
  }
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
      title: 'Отправитель',
      dataIndex: 'userOut',
      key: 'userOut',
    },
    {
      title: 'Получаетель',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: '',
      dataIndex: 'qr',
      key: 'qr',
      width: 120
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
      title: 'Создание посылок',
      description: 'Страница создание посылок, вы ней осуществляеться создание посылок',
      target: null,
    },
    {
      title: 'Поиск по номеру телефона',
      description: 'Введите номер телефона получателя и получите одну или несколько посылок',
      target: () => ref1.current,
    },
    {
      title: 'Добавление послыки',
      description: 'Кнопка "Добавить", при нажатии на неё всплывёт окно с формой для созданием посылки',
      target: () => ref2.current,
    }
  ];

  const onSelectChange = newSelectedRowKeys => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onFinish = async (values) => {
    await axios.post('/api/orders', {userData, ...values })
    refetch()
    setModalOpen(false)
  }



  return (
    <div className="">
      <Title level={2}>Создание посылок</Title>
      <div className={style.block}>
        <Flex style={{ marginBottom: '15px' }} justify='space-between'>
          <Space ref={ref1}>
            <InputNumber onKeyDown={(e) => e.key === 'Enter' && refetch()} size="large" addonBefore="+7" placeholder='9999999999' onChange={(value) => setNumber(value)} />
            <Button onClick={refetch} size="large" variant="solid" color='purple'>Поиск</Button>
          </Space>
          <Space>
            <Button ref={ref2} onClick={() => setModalOpen(true)} size="large" variant="solid" color='purple'>Добавить</Button>
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
        title="Создание посылки"
        centered
        okText="Создать"
        cancelText="Отмена"
        open={modalOpen}
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setModalOpen(false)}
        modalRender={dom => (
          <Form
            form={form}
            style={{ maxWidth: 600 }}
            onFinish={(value) => onFinish(value)}
            initialValues={{ variant: 'filled' }}
            name="form_in_modal"
            clearOnDestroy
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="userOut"
          rules={[{ required: true, message: 'введите номер телефона отправителя' }]}
        >
          <InputNumber style={{ width: '100%' }} addonBefore="+7" placeholder='9999999999' />
        </Form.Item>
        <Form.Item
          name="user"
          rules={[{ required: true, message: 'введите номер телефона получателя' }]}
        >
          <InputNumber style={{ width: '100%' }} addonBefore="+7" placeholder='9999999999' />
        </Form.Item>
        <Form.Item
          name="addressIn"
          rules={[{ required: true, message: 'введите адрес отправления' }]}
        >
          <Input placeholder='Откуда' />
        </Form.Item>
        <Form.Item
          name="addressOut"
          rules={[{ required: true, message: 'введите адрес доставления' }]}
        >
          <Input placeholder='Куда' />
        </Form.Item>
      </Modal>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  );
}
