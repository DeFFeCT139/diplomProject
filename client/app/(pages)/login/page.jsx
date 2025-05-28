'use client'

import { Button, Checkbox, Form, Input, message } from 'antd';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import style from './css/style.module.css';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        login: values.login,
        password: values.password,
      });

      if (result?.error) {
        message.error('Неверный логин или пароль');
      } else {
        console.log(result)
        message.success('Вход выполнен успешно');
        router.push('/dashboard/fatchOrders');
        router.refresh();
      }
    } catch (error) {
      message.error('Ошибка при входе в систему');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.form}>
      <div className={style.loginCard}>
        <Form
          name="loginForm"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Логин"
            name="login"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите ваш логин!'
              }
            ]}
          >
            <Input size="large" placeholder="Введите ваш логин" />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите ваш пароль!'
              }
            ]}
          >
            <Input.Password size="large" placeholder="Введите пароль" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Запомнить меня</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              Войти
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}