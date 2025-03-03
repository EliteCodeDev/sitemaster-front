import { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { EyeIcon, EyeSlashIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { UserIcon, ChatBubbleLeftEllipsisIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import ImagenQr from '../../ImagenQr';
import ButtonControl from '../../ButtonControl';
import WebhookControl from '../../WebhookControl';
import Preload from '../../../../components/loaders/OrderSkeleton';


// Función fetcher que usa axios y pasa instanceId como parámetro
const fetcher = (url, instanceId) =>
  axios.get(url, {
    headers: {
      apiKey: process.env.NEXT_PUBLIC_WAZEND_API_KEY,
    },
    params: { instanceId },
  }).then((res) => res.data);

const LayoutInstance = ({ instanceId }) => {
  const [isTokenVisible, setIsTokenVisible] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const { data: instanceData, error } = useSWR(
    instanceId ? [`${process.env.NEXT_PUBLIC_WAZEND_API_URL}/instance/fetchInstances`, instanceId] : null,
    ([url, id]) => fetcher(url, id)
  );

  if (error) return <p>Error: {error.message}</p>;
  if (!instanceData) return <Preload />;
  if (instanceData.length === 0) return <p>No instance data available</p>;

  const instance = instanceData[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(instance.token);
    toast.success('Copiado exitosamente.');
  };

  const handleShowQr = () => {
    setShowQr(true);
  };

  return (
    <>
      <div className='space-y-8'>

        {/* <h1 className="text-2xl font-bold tracking-tight text-gray-900">Instancia #{instance.name}</h1> */}


        {/* Seccion de conexion*/}

        {instance.connectionStatus === 'open' && (
          <section className='rounded-lg bg-white p-6 shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
            <h2 className='mb-4 text-xl font-semibold'>Tu número de WhatsApp conectado</h2>
            <div className="group block flex-shrink-0">
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block h-12 w-12 rounded-full"
                    src={instance.profilePicUrl}
                    alt={instance.profileName}
                  />
                </div>
                <div className="ml-3">
                  <p className="text-md font-semibold text-black">{instance.profileName}</p>
                  <p className="text-sm font-base text-gray-500">{instance.ownerJid}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <ButtonControl instanceName={instance.name} />
            </div>

          </section>
        )}

        {instance.connectionStatus !== 'open' && (
          <section className='rounded-lg bg-white p-6 shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
            <h2 className='mb-4 text-xl font-semibold'>Conecta tu WhatsApp</h2>
            <p className='mb-1'>Escanee el código QR para conectar su número de teléfono de WhatsApp con esta instancia.</p>
            <p className='mb-8'>Después de eso, podrá enviar y recibir mensajes de WhatsApp.</p>
            <div className='flex flex-col md:flex-row md:space-x-4'>

              <div className='w-full md:w-[500px] h-[280px] border-2 border-gray-200 p-2 rounded-lg overflow-hidden'>
                <Image
                  src='/images/scan-wa.webp'
                  alt='Hand holding a phone with WhatsApp'
                  className='w-full h-full object-cover rounded-md'
                  width={200}
                  height={50}
                  unoptimized
                />
              </div>


            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:justify-end sm:space-x-2 space-y-2 sm:space-y-0">
              <button
                onClick={handleShowQr}
                className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:bg-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                Mostrar QR
              </button>

              {showQr && (
                <div className="mt-4">
                  <ImagenQr instanceName={instance.name} />
                </div>
              )}

              <ButtonControl instanceName={instance.name} />
            </div>

          </section>
        )}


        <section className='rounded-lg bg-white shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
          <div className='flex flex-col md:flex-row'>

            {/* Primera columna */}
            <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0 md:border-r'>
              <div className='flex-1 flex-col p-4'>

                <div className='flex align-center justify-between'>
                  <div className='mb-8 md:mb-11'>
                    <h3 className='text-sm font-base'>Nombre de instancia</h3>
                    <p className='text-lg font-medium text-[var(--app-primary)]'>{instance.name}</p>
                  </div>

                  <div className='text-sm font-medium pt-5'>
                    <p
                      className={`rounded-full px-2.5 py-0.5 ${instance.connectionStatus === 'close'
                        ? 'bg-red-500 text-white'
                        : instance.connectionStatus === 'connecting'
                          ? 'bg-amber-500 text-white'
                          : instance.connectionStatus === 'open'
                            ? 'bg-[var(--app-primary)] text-white'
                            : 'bg-cyan-100'
                        }`}
                    >
                      {instance.connectionStatus === 'close'
                        ? 'Desconectado'
                        : instance.connectionStatus === 'connecting'
                          ? 'Conectando'
                          : instance.connectionStatus === 'open'
                            ? 'Conectado'
                            : instance.connectionStatus}
                    </p>
                  </div>

                </div>

                <div>
                  <h3 className='text-sm font-base'>Última conexión</h3>
                  <p className='text-lg font-semibold text-blue-500'>
                    {new Date(instance.updatedAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })} ({new Date(instance.updatedAt).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    })})
                  </p>
                </div>

              </div>
            </div>

            {/* Segunda columna */}
            <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0 md:border-r'>
              <div className='flex-1 flex-col p-4'>

                <div className='mb-8 md:mb-11'>
                  <h3 className='text-sm font-base'>Token (ApiKey)</h3>
                  <div className="flex items-center space-x-2">
                    <p className='text-lg font-medium text-[var(--app-primary)]'>
                      {isTokenVisible ? instance.token : '••••••••••'}
                    </p>
                    <button
                      onClick={() => setIsTokenVisible(!isTokenVisible)}
                      className="focus:outline-none"
                    >
                      {isTokenVisible ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-900" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-800" />
                      )}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="focus:outline-none"
                    >
                      <ClipboardIcon className="h-5 w-5 text-gray-800" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className='text-sm font-base'>Creado el</h3>
                  <p className='text-lg font-semibold text-blue-500'>
                    {new Date(instance.createdAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })} ({new Date(instance.createdAt).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    })})
                  </p>
                </div>


              </div>
            </div>

            {/* Final columna */}

          </div>
        </section>

        <section className='rounded-lg bg-white shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
          <div className='flex flex-col md:flex-row'>

            {/* Contactos */}
            <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0 md:border-r'>
              <div className='flex-1 flex-col p-4'>
                <div className="flex items-center space-x-1">
                  <UserIcon className="h-5 w-5 text-blue-500" />
                  <h3 className='text-sm font-base'>Contactos</h3>
                </div>
                <p className='mt-2 text-lg font-semibold text-blue-500'>{instance._count.Contact}</p>
              </div>
            </div>

            {/* Chats */}
            <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0 md:border-r'>
              <div className='flex-1 flex-col p-4'>
                <div className="flex items-center space-x-2">
                  <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-blue-500" />
                  <h3 className='text-sm font-base'>Chats</h3>
                </div>
                <p className='mt-2 text-lg font-semibold text-blue-500'>{instance._count.Chat}</p>
              </div>
            </div>

            {/* Mensajes */}
            <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0'>
              <div className='flex-1 flex-col p-4'>
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-5 w-5 text-blue-500" />
                  <h3 className='text-sm font-base'>Mensajes</h3>
                </div>
                <p className='mt-2 text-lg font-semibold text-blue-500'>{instance._count.Message}</p>
              </div>
            </div>

          </div>
        </section>


        {/* Seccion de ajustes*/}
        <WebhookControl instanceName={instance.name} />


      </div>
    </>
  );
};

export default LayoutInstance;
