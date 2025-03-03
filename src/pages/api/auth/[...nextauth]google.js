import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { signIn } from '../../../services/auth';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: 'Sign in with Email',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const { user, jwt } = await signIn({
            email: credentials.email,
            password: credentials.password,
          });

          return { ...user, jwt };
        } catch (error) {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === 'google') {
        try {
          console.log('🔍 Verificando usuario en Strapi con Google:', profile.email);

          // ✅ Consultamos Strapi para ver si el usuario ya existe
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?filters[email][$eq]=${profile.email}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
          });

          const users = await res.json();
          console.log('📢 Respuesta de Strapi:', users);

          if (!res.ok || !Array.isArray(users)) {
            console.error('❌ Error obteniendo usuarios de Strapi');
            return false;
          }

          if (users.length > 0) {
            const existingUser = users[0];

            if (existingUser.provider === 'local') {
              console.warn('🚫 Acceso denegado: la cuenta ya existe con email/password');
              return false;
            }
          }

          // ✅ Si el usuario es nuevo o ya usa Google, autenticamos en Strapi con Google
          const googleAuthRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google/callback?access_token=${account.access_token}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
          });

          const googleData = await googleAuthRes.json();
          console.log('🔑 Respuesta de autenticación con Google en Strapi:', googleData);

          if (!googleData.jwt) {
            console.error('❌ Error al autenticar con Strapi usando Google');
            return false;
          }

          return true;
        } catch (error) {
          console.error('❌ Error en signIn con Google:', error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (account?.provider === 'google') {
        try {
          const googleAuthRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google/callback?access_token=${account.access_token}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
          });

          const googleData = await googleAuthRes.json();

          if (!googleData.jwt) throw new Error('Error al autenticar con Strapi');

          token.id = googleData.user.id;
          token.jwt = googleData.jwt;
          token.name = googleData.user.username || googleData.user.email;
          token.email = googleData.user.email;
        } catch (error) {
          console.error('❌ Error autenticando con Strapi:', error);
        }
      } else if (user) {
        token.id = user.id;
        token.jwt = user.jwt;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      session.id = token.id;
      session.jwt = token.jwt;
      session.user.name = token.name;
      session.user.email = token.email;
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },
});
