'use client'
import { Col, Row, Tabs } from 'antd';
import style from '../css/page.module.css'
import Title from 'antd/es/typography/Title';
import Chart from './chart';
import { useQuery } from 'react-query';
import axios from 'axios';


export default function UserStatistick() {

  const givePackajes = async () => {
    const { data } = await axios.get('/api/statistic/user')
    return data.filter(item => item.userRole === 'CASHIER' || item.userRole === 'LOADER')
  }

  const { data, refetch, isLoading } = useQuery('Userstatistic', givePackajes)


  const items = [
    {
      key: '1',
      label: 'Все',
      children: (
        <Row gutter={15} style={{ marginBottom: '30px' }}>
          {data && data.map(item => 
            <Col key={data.indexOf(item)} xl={6}>
              <div className={style.grathBlock}>
                <Title style={{ margin: '10px' }} level={5}>{item.userName}</Title>
                <p style={{ marginLeft: '10px' }}>Отдел: {item.userRole === 'CASHIER'? 'выдачи': 'приёма'}</p>
                <Chart data={item.creationStats} width={300} height={150} />
              </div>
            </Col>
          )}
        </Row>
      ),
    },
    {
      key: '2',
      label: 'Отдел Выдачи',
      children: (
        <Row gutter={15} style={{ marginBottom: '30px' }}>
          {data && data.filter(item => item.userRole === 'CASHIER').map(item => 
            <Col key={data.indexOf(item)} xl={6}>
              <div className={style.grathBlock}>
                <Title style={{ margin: '10px' }} level={5}>{item.userName}</Title>
                <p style={{ marginLeft: '10px' }}>Отдел: {item.userRole === 'CASHIER'? 'выдачи': 'приёма'}</p>
                <Chart data={item.creationStats} width={300} height={150} />
              </div>
            </Col>
          )}
        </Row>
      ),
    },
    {
      key: '3',
      label: 'Отдел приёма',
      children: (
        <Row gutter={15} style={{ marginBottom: '30px' }}>
          {data && data.filter(item => item.userRole !== 'CASHIER').map(item => 
            <Col key={data.indexOf(item)} xl={6}>
              <div className={style.grathBlock}>
                <Title style={{ margin: '10px' }} level={5}>{item.userName}</Title>
                <p style={{ marginLeft: '10px' }}>Отдел: {item.userRole === 'CASHIER'? 'выдачи': 'приёма'}</p>
                <Chart data={item.creationStats} width={300} height={150} />
              </div>
            </Col>
          )}
        </Row>
      ),
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};