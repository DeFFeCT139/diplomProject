'use client'
import '@ant-design/v5-patch-for-react-19';
import { useSession } from 'next-auth/react';
import { Button, Flex, FloatButton, Input, Layout, Spin } from 'antd';
import style from './css/layoutMain.module.css'
import logo from '../../img/73027170_2584979534895572_6661102536423899136_o (1).png'
import { AppstoreAddOutlined, AppstoreOutlined, BarChartOutlined, CloseOutlined, CommentOutlined, HistoryOutlined, InsertRowAboveOutlined, LoadingOutlined, LogoutOutlined, MenuFoldOutlined, QuestionCircleOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from 'react-query';
import { signOut } from 'next-auth/react';
import { useTour } from '@/app/store/store';

const { Sider, Content } = Layout;

const roleBasedLinks = {
    ADMIN: [
        { title: 'Приём посылок', link: '/dashboard/fatchOrders', icon: <AppstoreAddOutlined /> },
        { title: 'Выдача посылок', link: '/dashboard/out-packages', icon: <MenuFoldOutlined /> },
        { title: 'Создание посылки', link: '/dashboard/add-packages', icon: <AppstoreAddOutlined /> },
        { title: 'Выгрузка посылок', link: '/dashboard/discharge', icon: <MenuFoldOutlined /> },
        { title: 'История посылок', link: '/dashboard/history', icon: <HistoryOutlined /> },
        { title: 'Сотрудники', link: '/dashboard/users', icon: <UserOutlined /> },
        { title: 'Посещаемость', link: '/dashboard/attendance', icon: <InsertRowAboveOutlined /> },
        { title: 'Статистика', link: '/dashboard/statistics', icon: <BarChartOutlined /> },
    ],
    МАNAGER: [
        { title: 'История посылок', link: '/dashboard/history', icon: <HistoryOutlined /> },
        { title: 'Посещаемость', link: '/dashboard/attendance', icon: <InsertRowAboveOutlined /> },
        { title: 'Сотрудники', link: '/dashboard/users', icon: <UserOutlined /> },
        { title: 'Статистика', link: '/dashboard/statistics', icon: <BarChartOutlined /> },
    ],
    CASHIER: [
        { title: 'Выдача посылок', link: '/dashboard/out-packages', icon: <MenuFoldOutlined /> },
        { title: 'Создание посылки', link: '/dashboard/add-packages', icon: <AppstoreAddOutlined /> },
        { title: 'История посылок', link: '/dashboard/history', icon: <HistoryOutlined /> },
    ],
    LOADER: [
        { title: 'Приём посылок', link: '/dashboard/fatchOrders', icon: <AppstoreAddOutlined /> },
        { title: 'Выгрузка посылок', link: '/dashboard/discharge', icon: <MenuFoldOutlined /> },
    ],
    HR: [
        { title: 'Сотрудники', link: '/dashboard/users', icon: <UserOutlined /> },
        { title: 'Посещаемость', link: '/dashboard/attendance', icon: <InsertRowAboveOutlined /> },
    ],
    ACCOUMTANT: [
        { title: 'Сотрудники', link: '/dashboard/users', icon: <UserOutlined /> },
        { title: 'Посещаемость', link: '/dashboard/attendance', icon: <InsertRowAboveOutlined /> },
        { title: 'Статистика', link: '/dashboard/statistics', icon: <BarChartOutlined /> },
    ]
};

export default function LayoutMain({ children }) {

    const tour = useTour(state => state.tour)
    const { data } = useSession();
    const path = usePathname();
    const router = useRouter();
    const queryClient = new QueryClient();

    // Получаем ссылки для текущей роли или пустой массив, если роль неизвестна
    const getLinksForRole = () => {
        return roleBasedLinks[data?.user?.role] || [];
    };

    return (
        <div className="App">
            {data? 
                <QueryClientProvider client={queryClient}>
                <Layout style={{ position: 'relative' }}>
                    <Sider className={style.sider} width="270px">
                        <div className="">
                            <div className={style.logo}>
                                <Image src={logo} alt="" />
                            </div>
                            {getLinksForRole().map((item) => (
                                <Button
                                    icon={item.icon}
                                    onClick={() => router.push(item.link)}
                                    key={item.link}
                                    className={style.button}
                                >
                                    {item.title}
                                    {path.includes(item.link) &&
                                        <div className={style.buttonActive}>
                                            <div className="">
                                                <div></div>
                                                <div></div>
                                            </div>
                                        </div>
                                    }
                                </Button>
                            ))}
                        </div>
                        <Button
                            onClick={async () => {
                                await signOut({
                                    redirect: false,
                                    callbackUrl: '/login'
                                });
                                router.push('/login');
                                router.refresh();
                            }}
                            icon={<LogoutOutlined />}
                            className={style.buttonExit}
                        >
                            Выход
                        </Button>
                    </Sider>
                    <Layout>
                        <Content className={style.content}>
                            <div style={{ backgroundColor: "#ffffff", textAlign: 'end' }}>
                                {data?.user.name} ({data?.user.role})
                            </div>
                            {children}
                        </Content>
                    </Layout>
                    <FloatButton onClick={() => tour(true)} icon={<QuestionCircleOutlined />} type="primary" style={{ insetInlineEnd: 24 }} />
                </Layout>
            </QueryClientProvider>:
            <div style={{width: '100%', height:'90vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
                <LoadingOutlined style={{ fontSize: 68, color:'rgb(25, 55, 255)' }} spin />
            </div>
            }
        </div>
    );
}