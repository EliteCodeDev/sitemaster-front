import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import Layout from '../../components/layout/auth';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline'

import { getSession } from 'next-auth/react';


const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


export default function ResetPassword() {
  const router = useRouter();
  const { code } = router.query;
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setpasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false); // Nuevo estado para controlar el estado de carga
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado para controlar la visibilidad de la contraseña

  const handleResetPassword = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento de envío predeterminado del formulario

    try {
      if (password !== passwordConfirmation) {
        toast.error('Las contraseñas no coinciden.');
        return;
      }

      setLoading(true); // Establecer el estado de carga como verdadero al iniciar la solicitud
      await axios.post(`${strapiUrl}/api/auth/reset-password`, { code, password, passwordConfirmation },
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      ); // Envía tanto password como confirmPassword
      setLoading(false); // Establecer el estado de carga como falso cuando la solicitud se completa
      toast.success('Contraseña restablecida con éxito.');
      router.replace('/login');
    } catch (error) {
      setLoading(false); // Establecer el estado de carga como falso si hay un error
      toast.error('Ha ocurrido un error.');
    }
  };

  return (
    <Layout>
      <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
        Restablecer contraseña
      </h2>

      <div className="mt-8">
        <form className="space-y-6" onSubmit={handleResetPassword}> {/* Usar onSubmit en lugar de onClick */}
          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
            >
              Contraseña
            </label>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'} // Alternar entre tipo de entrada password y text
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6} // Validación de longitud mínima
                required
                className="block w-full rounded-md border-0 py-1.5 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[var(--app-primary)] sm:text-sm sm:leading-6"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 dark:text-gray-300 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)} // Alternar entre mostrar y ocultar la contraseña
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label
              htmlFor="passwordConfirmation"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
            >
              Confirmar contraseña
            </label>
            <div className="mt-2 relative">
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type={showPassword ? 'text' : 'password'} // Alternar entre tipo de entrada password y text
                placeholder="••••••••"
                value={passwordConfirmation}
                onChange={(e) => setpasswordConfirmation(e.target.value)}
                minLength={6} // Validación de longitud mínima
                required
                className="block w-full rounded-md border-0 py-1.5 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[var(--app-primary)] sm:text-sm sm:leading-6"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 dark:text-gray-300 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)} // Alternar entre mostrar y ocultar la contraseña
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading} // Desactivar el botón mientras se carga la solicitud
            className={`text-white flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[var(--app-primary)] hover:bg-[var(--app-primary)] focus:ring-[var(--app-primary)]'
              }`}
          >
            {loading ? 'Cargando...' : 'Restablecer contraseña'}
          </button>
        </form>

        {/* Enlace */}
        <p className="mt-10 text-sm text-center leading-6 text-gray-500 dark:text-gray-400">
          <Link
            href="/login"
            className="font-semibold leading-6 text-[var(--app-primary)] hover:text-[var(--app-primary)] dark:hover:text-[var(--app-primary)]"
          >
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </Layout>

  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  // Check if session exists or not, if not, redirect
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};