'use client'

import { Button, Card, Flex, Input, message, Modal, Space, Table } from 'antd';
import style from './css/page.module.css'
import Title from 'antd/es/typography/Title';
import { useState } from 'react';

export default function Homed() {

  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState({
    code:'',
    list: []
  });

  const hasSelected = selectedRowKeys.length > 0;

  const dataSource = [
    {
      key: '1',
      status: 32,
      user: '89999999999',
      addressIn: '10 Downing Street',
      addressOut: '11 Downing Street',
      button: <Button disabled={hasSelected} onClick={() => sendSMS(['1'])} size="large" variant="solid" color='purple'>Выдать</Button>
    },
    {
      key: '2',
      status: 42,
      user: '89999999998',
      addressIn: '10 Downing Street',
      addressOut: '11 Downing Street',
      button: <Button disabled={hasSelected} onClick={() => sendSMS(['2'])} size="large" variant="solid" color='purple'>Выдать</Button>
    },
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'key',
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

  const onSelectChange = newSelectedRowKeys => {
    console.log(newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const sendSMS = (data) => {
    setCode({
      code: '111111',
      list:data === 'all'?selectedRowKeys:data
    })
    setModalOpen(true)
  }

  const onChange = text => {
    console.log('onChange:', text);
  };

  const sharedProps = {
    onChange,
  };

  return (
    <div className="">
      {contextHolder}
      <Title level={2}>Выдача посылок</Title>
      <div className={style.block}>
        <Flex style={{ marginBottom: '15px' }} justify='space-between'>
          <Space>
            <Input size="large" placeholder='79999999999' />
            <Button size="large" variant="solid" color='purple'>Поиск</Button>
          </Space>
          <Space>
            {dataSource.length > 1 &&
              <Button disabled={!hasSelected} onClick={() => sendSMS('all')} size="large" variant="solid" color='purple'>Выдать</Button>
            }
          </Space>
        </Flex>
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          dataSource={dataSource}
          columns={columns}
        />
      </div>
      <Modal
        title="Введите код из СМС"
        centered
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      >
        <div style={{display:'flex', justifyContent:'center', padding:'30px 0px'}}>
          <Input.OTP formatter={str => str.toUpperCase()} {...sharedProps} />
        </div>
      </Modal>
    </div>
  );
}
