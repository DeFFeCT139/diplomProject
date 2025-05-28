'use client'
import { Flex } from 'antd';
import style from '../css/page.module.css'
import Title from 'antd/es/typography/Title';
import Chart from './chart';
import axios from 'axios';
import { useQuery } from 'react-query';


export default function AllStatistics() {


  const givePackajes = async () => {
    const { data } = await axios.get('/api/statistic/all')
    return data
  }

  const { data, refetch, isLoading } = useQuery('Allstatistic', givePackajes)

  return (
      <div>
        <Title level={3}>За Апрель</Title>
        <Flex justify='space-around' gap={15}>
          <div className={style.grathBlock}>
            <Title level={5}>Приём/Создание</Title>
            <Chart data={data?data.stats.lastMonthCreation: []} width={650} height={250}/>
          </div>
          <div className={style.grathBlock}>
            <Title level={5}>Выдача/Выгрузка</Title>
            <Chart data={data?data.stats.lastMonthSending: []} width={650} height={250}/>
          </div>
        </Flex>
        <Title level={3}>За Май</Title>
        <Flex justify='space-around' gap={15}>
          <div className={style.grathBlock}>
            <Title level={5}>Приём/Создание</Title>
            <Chart data={data?data.stats.currentMonthCreation: []} width={650} height={250}/>
          </div>
          <div className={style.grathBlock}>
            <Title level={5}>Выдача/Выгрузка</Title>
            <Chart data={data?data.stats.currentMonthSending: []} width={650} height={250}/>
          </div>
        </Flex>
      </div>
  );
};