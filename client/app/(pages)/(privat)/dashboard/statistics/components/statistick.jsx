'use client'
import { Col, Typography, Row, Space } from 'antd';
import style from '../css/page.module.css'
import { Liquid, Pie } from '@ant-design/plots';
import Title from 'antd/es/typography/Title';
import { useQuery } from 'react-query';
import axios from 'axios';


const { Text } = Typography;

export default function Statistick() {


  const givePackajes = async () => {
    const { data } = await axios.get('/api/statistic')
    return data
  }

  const { data, refetch, isLoading } = useQuery('statistic', givePackajes)

  const config = {
    percent: data?data.statsMonth/100: 0,
    style: {
      outlineBorder: 4,
      outlineDistance: 8,
      waveLength: 128,
    },
  };

  const config2 = {
    data: [
      { type: 'Создание', value: data?data.statsGet.creation: 0 },
      { type: 'Выдача', value: data?data.statsGet.sending: 0 },
    ],
    angleField: 'value',
    colorField: 'type',
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
  };

  return (
    <div>
      <Title style={{ margin: '10px' }} level={3}>Общая статистика</Title>
      <Row gutter={15} style={{ marginBottom: '30px' }}>
        <Col xl={12}>
          <div className={style.StatBlock}>
            <Title style={{ margin: '10px 10px 20px 10px' }} level={5}>Средние статистические даннные</Title>
            <section className={style.textBlock}>
              <Row gutter={15} justify='space-between'>
                <Col xl={12}>
                  <Space className={style.textBloksInfo} direction="vertical">
                    <Title level={5} style={{ margin: '10px 0px 5px 0px' }}>Количество сотрудников:</Title>
                    <Text style={{ fontSize: '18px' }}>{data?data.user:0}</Text>
                  </Space>
                </Col>
                <Col style={{ marginBottom: '15px' }} xl={12}>
                  <Space className={style.textBloksInfo} direction="vertical">
                    <Title level={5} style={{ margin: '10px 0px 5px 0px' }}>Самый продуктивный сотрудник:</Title>
                    <Text style={{ fontSize: '18px' }} type="success">{data?data.mostProductive.name:' '}</Text>
                  </Space>
                </Col>
                <Col style={{ marginBottom: '15px' }} xl={12}>
                  <Space className={style.textBloksInfo} direction="vertical">
                    <Title level={5} style={{ margin: '10px 0px 5px 0px' }}>Самый не продуктивный сотрудник:</Title>
                    <Text style={{ fontSize: '18px' }} type="danger">{data?data.leastProductive.name:' '}</Text>
                  </Space>
                </Col>
                <Col xl={12}>
                  <Space className={style.textBloksInfo} direction="vertical">
                    <Title level={5} style={{ margin: '10px 0px 5px 0px' }}>Количество посылок на скаладе:</Title>
                    <Text style={{ fontSize: '18px' }}>{data?data.created:' '}</Text>
                  </Space>
                </Col>
                <Col xl={12}>
                  <Space className={style.textBloksInfo} direction="vertical">
                    <Title level={5} style={{ margin: '10px 0px 5px 0px' }}>Количество отправленых посылок:</Title>
                    <Text style={{ fontSize: '18px' }}>{data?data.inTransit:' '}</Text>
                  </Space>
                </Col>
              </Row>
            </section>
          </div>
        </Col>
        <Col xl={6}>
          <div className={style.StatBlock}>
            <Title style={{ margin: '10px' }} level={5}>Количество выполненых услуг</Title>
            <Pie width={300} height={300} {...config2} />
          </div>
        </Col>
        <Col xl={6}>
          <div className={style.StatBlock}>
            <Title style={{ margin: '10px' }} level={5}>Отношение объёма посылок П/Н месяц</Title>
            <Liquid width={300} height={300}{...config} />
          </div>
        </Col>
      </Row>
    </div>
  );
};