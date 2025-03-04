import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Layout from '../../components/layout/auth';
import Spin from '../../components/loaders/spin';
import SignSocial from '../../components/SignSocial';
import { strapiUrl } from '@/routes/routes';

// const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordConditions, setPasswordConditions] = useState({
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    length: false
  });
  const [showPasswordConditions, setShowPasswordConditions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      validatePasswordConditions(value);
    }
  };

  const generateUsername = (email) => {
    return email.replace(/[^a-zA-Z0-9]/g, '');
  };

  const validatePasswordConditions = (password) => {
    const conditions = {
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
      length: password.length >= 6
    };

    setPasswordConditions(conditions);
  };

  const isPasswordValid = () => {
    return Object.values(passwordConditions).every(condition => condition);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      const username = generateUsername(formData.email);
      const response = await axios.post(`${strapiUrl}/api/auth/local/register`, {
        username,
        name: formData.name,
        email: formData.email,
        password: formData.password
      },
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Registration successful:', response.data);
      toast.success('Registro exitoso.');


      // Enviar los datos al webhook de n8n
      try {
        await axios.post(process.env.NEXT_PUBLIC_REGISTER, {
          username: username,
          name: formData.name,
          email: formData.email,
        });
        console.log('Datos enviados al webhook de n8n.');
      } catch (webhookError) {
        console.error('Error al enviar datos al webhook de n8n:', webhookError);
      }
      // Enviar los datos al webhook de n8n acaba

      router.replace('/email-confirmation');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Ha ocurrido un error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordFocus = () => {
    setShowPasswordConditions(true);
  };

  return (
    <>
      <Layout>
        <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
          🎉 Crea una cuenta nueva
        </h2>

        <div className="mt-8">
          <form className="space-y-6" onSubmit={handleSubmit}>


            {/* Nombre */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Nombre completo
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Tu nombre completo"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[var(--app-primary)] sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Correo electrónico
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@ejemplo.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[var(--app-primary)] sm:text-sm sm:leading-6"
                />
              </div>
            </div>

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
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={handlePasswordFocus}
                  className="block w-full rounded-md border-0 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[var(--app-primary)] sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 dark:text-gray-300 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Condiciones de contraseña */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {showPasswordConditions && (
                <ul>
                  <li className={`${passwordConditions.uppercase ? 'text-[var(--app-primary)] dark:text-[var(--app-primary)]' : 'text-gray-500 dark:text-gray-400'}`}>
                    <div className="inline-flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                      Una letra mayúscula
                    </div>
                  </li>
                  <li className={`${passwordConditions.lowercase ? 'text-[var(--app-primary)] dark:text-[var(--app-primary)]' : 'text-gray-500 dark:text-gray-400'}`}>
                    <div className="inline-flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                      Una letra minúscula
                    </div>
                  </li>
                  <li className={`${passwordConditions.number ? 'text-[var(--app-primary)] dark:text-[var(--app-primary)]' : 'text-gray-500 dark:text-gray-400'}`}>
                    <div className="inline-flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                      Un número
                    </div>
                  </li>
                  <li className={`${passwordConditions.specialChar ? 'text-[var(--app-primary)] dark:text-[var(--app-primary)]' : 'text-gray-500 dark:text-gray-400'}`}>
                    <div className="inline-flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                      Un carácter especial
                    </div>
                  </li>
                  <li className={`${passwordConditions.length ? 'text-[var(--app-primary)] dark:text-[var(--app-primary)]' : 'text-gray-500 dark:text-gray-400'}`}>
                    <div className="inline-flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                      6 caracteres o más
                    </div>
                  </li>
                </ul>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || !isPasswordValid()}
                className={`text-white w-full justify-center inline-flex items-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--app-primary)] ${isSubmitting || !isPasswordValid() ? 'bg-gray-400 cursor-not-allowed' : 'bg-[var(--app-primary)] hover:bg-[var(--app-primary-hovered)] focus:ring-[var(--app-primary)]'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <Spin />
                    Regístrate
                  </>
                ) : (
                  'Regístrate'
                )}
              </button>
            </div>
          </form>

          {/* Botón para iniciar sesión con GitHub */}
          <SignSocial />


          <p className="mt-10 text-sm text-center leading-6 text-gray-500 dark:text-gray-400">
            ¿Tienes una cuenta?{' '}
            <Link
              href="/login"
              className="font-semibold leading-6 text-[var(--app-primary)] hover:text-[var(--app-primary)] dark:hover:text-[var(--app-primary)]"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </Layout>

    </>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
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