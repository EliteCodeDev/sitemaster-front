// src/pages/vps/[instanceId]/dashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/dashboard';
import {
  PlayIcon,
  StopIcon,
  ArrowPathIcon,
  PowerIcon,
  KeyIcon,
  ArrowLeftIcon,
  ServerIcon,
  ClockIcon,
  GlobeAltIcon,
  CpuChipIcon,
  CubeIcon,
  DocumentTextIcon,
  TagIcon,
  BuildingOfficeIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
export default function VpsDashboard() {
  const router = useRouter();
  const { instanceId } = router.query;

  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [actionResult, setActionResult] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  


  // Cargar los datos de la instancia
  useEffect(() => {
    async function fetchInstanceDetails() {
      if (!instanceId) return;

      try {
        setLoading(true);



        const response = await fetch(`/api/contabo/${instanceId}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setInstance(data.data[0]);
      } catch (err) {
        console.error('Error al obtener detalles de la instancia:', err);
        setError('No se pudieron cargar los detalles de la instancia. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchInstanceDetails();
  }, [instanceId, actionResult]);

  // Ejecutar una acción en la instancia
  const executeAction = async (action) => {
    if (!instanceId || actionInProgress) return;

    try {
      setActionInProgress(true);
      setActionResult(null);

      const response = await fetch(`/api/contabo/${instanceId}/actions/${action}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error al ejecutar ${action}`);
      }

      setActionResult({
        success: true,
        message: `Acción ${action} ejecutada correctamente`,
        data
      });

    } catch (err) {
      console.error(`Error al ejecutar ${action}:`, err);
      setActionResult({
        success: false,
        message: err.message || `Error al ejecutar ${action}`
      });
    } finally {
      setActionInProgress(false);

      // Esperar 5 segundos antes de limpiar el mensaje de resultado
      setTimeout(() => {
        setActionResult(null);
      }, 5000);
    }
  };

  // Formatear la memoria en GB
  const formatMemory = (mb) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(0)} GB`;
    }
    return `${mb} MB`;
  };

  if (loading) return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h1 className="text-xl font-bold text-red-700 mb-2">Error</h1>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push('/vps')}
            className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Volver
          </button>
        </div>
      </div>
    </Layout>
  );

  if (!instance) return null;

  return (
    <Layout>
      <Head>
        <title>{instance.name || `VPS ${instanceId}`} - Dashboard</title>
      </Head>

      <div className="max-w-5xl mx-auto p-6">
        {/* Navegación superior */}
        <div className="mb-6">
          <Link href="/vps" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span>Volver a mis instancias</span>
          </Link>
        </div>

        {/* Cabecera */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{instance.name || `VPS ${instanceId}`}</h1>
              <div className="mt-2 flex items-center">
                <span
                  className={`inline-block w-3 h-3 rounded-full mr-2 ${instance.status === 'running' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                ></span>
                <span className={`font-medium ${instance.status === 'running' ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {instance.status === 'running' ? 'Activo' : 'Detenido'}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <span className="font-mono text-lg">{instance.ipConfig?.v4?.ip || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Mensaje de resultado de acción */}
        {actionResult && (
          <div className={`mb-6 p-4 rounded-lg ${actionResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
            <p className={`font-medium ${actionResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
              {actionResult.message}
            </p>
            {actionResult.success && actionResult.data && actionResult.data.data && actionResult.data.data.password && (
              <div className="mt-2 bg-white p-3 rounded border border-green-300">
                <p className="text-sm text-gray-700 mb-2">Nueva contraseña generada:</p>
                <div className="flex items-center">
                  <div className="flex-1 font-mono bg-gray-100 p-2 rounded">
                    {showPassword ? actionResult.data.data.password : '•'.repeat(12)}
                  </div>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 p-2 text-gray-600 hover:text-gray-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      )}
                    </svg>
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">Guarda esta contraseña en un lugar seguro. No podrás verla de nuevo.</p>
              </div>
            )}
          </div>
        )}

        {/* Grid de información y acciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Panel izquierdo - Información de la instancia */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Información de la instancia</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <ServerIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">ID de Instancia</p>
                    <p className="font-medium">{instance.instanceId}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <TagIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Nombre de Host</p>
                    <p className="font-medium">{instance.vHostName || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha de creación</p>
                    <p className="font-medium">
                      {new Date(instance.createdDate).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Data Center</p>
                    <p className="font-medium">{instance.dataCenter || instance.regionName || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <GlobeAltIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Región</p>
                    <p className="font-medium">{instance.region}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CommandLineIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Sistema Operativo</p>
                    <p className="font-medium">{instance.osType || 'No disponible'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CpuChipIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">vCPUs</p>
                    <p className="font-medium">{instance.cpuCores}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CubeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Memoria RAM</p>
                    <p className="font-medium">{formatMemory(instance.ramMb)}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CubeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Almacenamiento</p>
                    <p className="font-medium">{formatMemory(instance.diskMb)}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <KeyIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Usuario por defecto</p>
                    <p className="font-medium">{instance.defaultUser || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <TagIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Producto</p>
                    <p className="font-medium">{instance.productName || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Dirección MAC</p>
                    <p className="font-medium font-mono">{instance.macAddress || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel derecho - Acciones */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Acciones</h2>

              <div className="space-y-3">
                <button
                  onClick={() => executeAction('start')}
                  disabled={instance.status === 'running' || actionInProgress}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-white font-medium ${instance.status === 'running' || actionInProgress
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                  <PlayIcon className="h-5 w-5" />
                  <span>Iniciar</span>
                </button>

                <button
                  onClick={() => executeAction('stop')}
                  disabled={instance.status !== 'running' || actionInProgress}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-white font-medium ${instance.status !== 'running' || actionInProgress
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600'
                    }`}
                >
                  <StopIcon className="h-5 w-5" />
                  <span>Detener</span>
                </button>

                <button
                  onClick={() => executeAction('restart')}
                  disabled={instance.status !== 'running' || actionInProgress}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-white font-medium ${instance.status !== 'running' || actionInProgress
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                  <ArrowPathIcon className="h-5 w-5" />
                  <span>Reiniciar</span>
                </button>

                <button
                  onClick={() => executeAction('shutdown')}
                  disabled={instance.status !== 'running' || actionInProgress}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-white font-medium ${instance.status !== 'running' || actionInProgress
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                  <PowerIcon className="h-5 w-5" />
                  <span>Apagar</span>
                </button>

                <div className="border-t border-gray-200 my-4 pt-4">
                  <button
                    onClick={() => executeAction('resetPassword')}
                    disabled={actionInProgress}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium ${actionInProgress
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                  >
                    <KeyIcon className="h-5 w-5" />
                    <span>Restablecer contraseña</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}