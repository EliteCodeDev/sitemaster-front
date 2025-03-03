import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { signIn } from '../../../services/auth';

export default NextAuth({
  providers: [
    // Proveedor de Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Proveedor de Credenciales (Strapi)
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
    async jwt({ token, user, account }) {
      if (account?.provider === 'google') {
        try {
          // Enviar el token de Google a Strapi para registrar o autenticar al usuario
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google/callback?access_token=${account.access_token}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
          });

          const data = await res.json();
          if (!data.jwt) throw new Error('Error al autenticar con Strapi');

          token.id = data.user.id;
          token.jwt = data.jwt;
          token.name = data.user.name || data.user.username;
          token.email = data.user.email;
        } catch (error) {
          console.error('Error autenticando con Strapi:', error);
        }
      } else if (user) {
        token.id = user.id;
        token.jwt = user.jwt;
        token.name = user.name;
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
