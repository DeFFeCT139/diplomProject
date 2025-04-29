'use client'

import { Button, Popover, QRCode, Table } from "antd";
import Title from "antd/es/typography/Title";
import axios from "axios";
import { useQuery } from "react-query";

export default function Home() {

  const fetchRaffles = async () => {
    const response = await axios.get('/api/get');
    const raffles = response.data.sort((a, b) => a.id - b.id).map((item, index) => ({
      ...item,
      key: index + 1,
      qr: <Popover content={<QRCode value={JSON.stringify({
        id: item.id,
        code: 'pochta'
      })} bordered={false} />}>
        <Button type="primary">Hover me</Button>
      </Popover >
    }));
    return raffles
  };

  const { data } = useQuery('packages', fetchRaffles)

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
      dataIndex: 'qr',
      key: 'qr',
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '100px auto 0px auto' }}>
      <Title level={2}>Посылки</Title>
      <Table dataSource={data} columns={columns} />
    </div>
  );
}
