'use client'

import { Button, Flex, Form, Input, Tour, Modal, Select, Space, Table } from 'antd';
import style from './css/page.module.css'
import Title from 'antd/es/typography/Title';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { DeleteOutlined } from '@ant-design/icons';
import { useTour } from '@/app/store/store';

export default function Homed() {
  const ref1 = useRef(null);

  const setTour = useTour(state => state.setTour)

  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);



  const givePackajes = async () => {
    const { data } = await axios.get('/api/users')
    const role = await axios.get('/api/role')
    const queryData = data.map(item => ({
      ...item,
      key: item.id,
      button: <Button onClick={async () => {
        await axios.delete(`/api/users/${item.id}`)
        refetch()
      }} size="large" variant="solid" color='red'><DeleteOutlined /></Button>
    }))
    return { role: role.data, listuser: queryData }
  }

  useEffect(()=> {
    setTour(setOpen)
  },[])

  const { data, refetch } = useQuery('users', givePackajes)

  const columns = [
    {
      title: 'ФИО',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Логин',
      dataIndex: 'login',
      key: 'login',
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '',
      dataIndex: 'button',
      key: 'button',
      width: 20
    }
  ];

  const onFinish = async value => {
    await axios.post('/api/users', value)
    await refetch()
    setModalOpen(false)
    console.log(value)
  }

  const steps = [
    {
      title: 'Сотрудники',
      description: 'Страница сотрудники, в ней осуществляеться создание пользователей системой',
      target: null,
    },
    {
      title: 'Поиск по номеру телефона',
      description: 'Кнопка "Добавить", при нажатии на неё всплывёт окно с формой создания пользователя',
      target: () => ref1.current,
    }
  ];


  return (
    <div className="">
      <Title level={2}>Сотрудники</Title>
      <div className={style.block}>
        <Flex style={{ marginBottom: '15px' }} justify='space-between'>
          <div className=""></div>
          <Space>
            <Button ref={ref1} onClick={() => setModalOpen(true)} size="large" variant="solid" color='purple'>Добавить</Button>
          </Space>
        </Flex>
        <Table
          dataSource={data?.listuser}
          columns={columns}
        />
      </div>
      <Modal
        title="Создание пользователя"
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
          name="name"
          rules={[{ required: true, message: 'введите ФИО' }]}
        >
          <Input placeholder='ФИО' />
        </Form.Item>
        <Form.Item
          name="login"
          rules={[{ required: true, message: 'введите логин' }]}
        >
          <Input placeholder='Логин' />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'введите пароль' }]}
        >
          <Input placeholder='Пароль' />
        </Form.Item>
        <Form.Item
          name="role"
          rules={[{ required: true, message: 'Выберите роль' }]}
        >
          <Select placeholder='Роль'>
            {data?.role.map(item =>
              <Select.Option key={data?.role.indexOf(item)} value={item}>{item}</Select.Option>
            )}
          </Select>
        </Form.Item>
      </Modal>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  );
}
