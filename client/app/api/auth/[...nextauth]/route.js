import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { verifyPassword } from '@/app/lib/auth';

const prisma = new PrismaClient();

const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        login: { 
          label: "Login", 
          type: "text",
          placeholder: "Введите ваш логин"
        },
        password: { 
          label: "Password", 
          type: "password",
          placeholder: "Введите пароль"
        }
      },
      async authorize(credentials) {
        try {
          // 1. Находим пользователя
          const user = await prisma.user.findUnique({
            where: { 
              login: credentials.login 
            },
            select: {
              id: true,
              name: true,
              login: true,
              password: true,
              role: true,
            }
          });

          if (!user) {
            throw new Error('Пользователь не найден');
          }

          // 2. Проверяем пароль
          const isValid = await verifyPassword(
            credentials.password, 
            user.password
          );

          if (!isValid) {
            throw new Error('Неверный пароль');
          }

          // 3. Возвращаем объект пользователя
          return {
            id: user.id,
            email: user.email || `${user.login}@temp-domain.com`, // NextAuth требует email
            name: user.name, // Используем login как name
            role: user.role,
            login: user.login // Дополнительное поле
          };
          
        } catch (error) {
          console.error('Ошибка авторизации:', error);
          throw new Error('Ошибка при входе в систему');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Добавляем дополнительные поля в JWT токен
      if (user) {
        token.role = user.role;
        token.login = user.login;
      }
      return token;
    },
    async session({ session, token }) {
      // Добавляем поля в сессию
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.sub;
        session.user.login = token.login;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Кастомная логика редиректа
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login' // Страница для отображения ошибок
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development' // Включить логи в разработке
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };