'use client'
import '@ant-design/v5-patch-for-react-19';

import { Button, Layout } from 'antd';
import style from './css/layoutMain.module.css'
import logo from '../../img/73027170_2584979534895572_6661102536423899136_o (1).png'
import { AppstoreAddOutlined, AppstoreOutlined, BarChartOutlined, HistoryOutlined, InsertRowAboveOutlined, LogoutOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from 'react-query';
const { Sider, Content } = Layout;

export default function LayoutMain({ children }) {

    const path = usePathname()
    const router = useRouter()

    let links = [
        { title: 'Приём посылок', link: '/', icon: <AppstoreAddOutlined /> },
        { title: 'Выдача посылок', link: '/out-packages', icon: <MenuFoldOutlined /> },
        { title: 'Создание посылки', link: '/add-packages', icon: <AppstoreAddOutlined /> },
        { title: 'Выгрузка посылок', link: '/gdr', icon: <MenuFoldOutlined /> },
        { title: 'Сотрудники', link: '/gdr', icon: <UserOutlined /> },
        { title: 'Посещаемость', link: '/gdr', icon: <InsertRowAboveOutlined /> },
        { title: 'История посылок', link: '/gdr', icon: <HistoryOutlined /> },
        { title: 'Статистика', link: '/gdr', icon: <BarChartOutlined /> },
    ]
    const queryClient = new QueryClient()

    return (
        <div className="App">
            <QueryClientProvider client={queryClient}>
                <Layout >
                    <Sider className={style.sider} width="270px">
                        <div className="">
                            <div className={style.logo}>
                                <Image src={logo} alt="" />
                            </div>
                            {links.map(item =>
                                <Button icon={item.icon} onClick={() => router.push(item.link)} key={links.indexOf(item)} className={style.button}>
                                    {item.title}
                                    {path === item.link ?
                                        <div className={style.buttonActive}>
                                            <div className="">
                                                <div></div>
                                                <div></div>
                                            </div>
                                        </div> :
                                        <div className=""></div>
                                    }
                                </Button>
                            )}
                        </div>
                        <Button icon={<LogoutOutlined />} className={style.buttonExit}>Выход</Button>
                    </Sider>
                    <Layout>

                        <Content className={style.content}>
                            <div style={{ backgroundColor: "#ffffff", textAlign: 'end' }}>Иванов Иван Иваныч</div>
                            {children}
                        </Content>
                    </Layout>
                </Layout>
            </QueryClientProvider>
        </div>
    );
}

