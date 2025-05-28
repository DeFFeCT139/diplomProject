'use client'
import '@ant-design/v5-patch-for-react-19';

import { Button, Drawer, Flex, Form, Input, Popover, QRCode, Space, Table } from "antd";
import Title from "antd/es/typography/Title";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchRaffles = async () => {
    const response = await axios.get('/api/orders');
    const raffles = response.data.sort((a, b) => a.id - b.id).map((item, index) => ({
      ...item,
      key: index + 1,
      qr: <Popover content={<QRCode value={JSON.stringify({
        id: item.id,
        code: 'pochta'
      })} bordered={false} />}>
        <Button type="primary">Наведи</Button>
      </Popover >
    }));
    return raffles
  };

  const { data, refetch } = useQuery('packages', fetchRaffles)

  const columns = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Откуда',
      dataIndex: 'addressIn',
      key: 'addressIn',
    },
    {
      title: 'Куда',
      dataIndex: 'addressOut',
      key: 'addressOut',
    },
    {
      title: 'Номер Телефона',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Дата',
      dataIndex: 'dateTime',
      key: 'dateTime',
    },
    {
      title: 'QR',
      dataIndex: 'qr',
      key: 'qr',
      width: 40
    }
  ];

  const onFinish = async (values) => {
    await axios.post('/api/orders', {status: 1, ...values})
    await refetch()
    setOpen(false)
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '100px auto 0px auto' }}>
      <Flex align="center" justify='space-between'>
        <Title level={2}>Посылки</Title>
        <Button onClick={() => setOpen(true)} type="primary">Добавить</Button>
      </Flex>
      <Table dataSource={data} columns={columns} />
      <Drawer
        title="Добавление заказа"
        width={500}
        onClose={() => setOpen(false)}
        open={open}
        extra={
          <Space>
            <Button onClick={() => setOpen(false)}>Отмена</Button>
          </Space>
        }
      >
        <Form
          form={form}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          initialValues={{ variant: 'filled' }}
        >
          <Form.Item
            label="Номер Телефона получателя"
            name="user"
            rules={[{ required: true, message: 'введите номер телефона' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Номер Телефона отправителя"
            name="userOut"
            rules={[{ required: true, message: 'введите номер телефона' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Откуда"
            name="addressIn"
            rules={[{ required: true, message: 'введите адрес отправления' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Куда"
            name="addressOut"
            rules={[{ required: true, message: 'введите адрес доставления' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Добавить
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
