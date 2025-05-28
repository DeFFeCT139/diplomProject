'use client'
import { Collapse } from 'antd';
import style from './css/page.module.css'
import Title from 'antd/es/typography/Title';
import AllStatistics from './components/allsttistick';
import Statistick from './components/statistick';
import UserStatistick from './components/UserStatistick';


const items = [
  {
    key: '1',
    label: <Title style={{margin:'0'}} level={5}>Общаяя статистика отработки отделов приёма и выдачи</Title>,
    children: <AllStatistics/>,
  },
  {
    key: '2',
    label: <Title style={{margin:'0'}} level={5}>Статистика сотрудников</Title>,
    children: <UserStatistick/>,
  },
];

export default function Home() {
  return (
    <div className="">
      <Title level={2}>Статистика</Title>
      <div className={style.block}>
        <Statistick/>
        <Collapse style={{backgroundColor:'#ffffff'}} items={items}/>
      </div>
    </div>
  );
};