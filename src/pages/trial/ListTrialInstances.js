import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import InstanceCard from '../dashboard/instanceCard';
import OrderSkeleton from '../../components/loaders/OrderSkeleton';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import CreateButton from './CreateButton';
import DeleteButton from './DeleteButton';

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetcher = async (url, jwt) => {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) throw new Error(`❌ Error en la solicitud: ${response.statusText}`);

    return await response.json();
  } catch (error) {
    console.error('❌ Error al obtener datos de Strapi:', error);
    throw error;
  }
};

const FetchStrapi = () => {
  const { data: session } = useSession();
  const jwt = session?.jwt;

  const { data, error, isLoading } = useSWR(
    jwt ? `${strapiUrl}/api/users/me?populate=freetrials` : null,
    (url) => fetcher(url, jwt)
  );

  // Muestra el loader mientras está cargando y no muestra nada más
  if (isLoading) return <OrderSkeleton />;

  // Muestra error si ocurre
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  if (!data) return <OrderSkeleton />;

  return (
    <>
      {data?.freetrials?.length > 0 ? (
        <div className="grid grid-cols-1">
          {data.freetrials.map((sub, index) => (
            <div key={index}>
              <InstanceCard instanceId={sub.instanceId} instanceName={`Instancia gratis - ${sub.instanceName}`} isActive={true} endDate={sub.endDate} />
              {/* <DeleteButton documentId={sub.documentId} instanceName={sub.instanceName} /> */}
            </div>
          ))}
        </div>
      ) : (
        <CreateButton />
      )}

      <div className="mt-8">
        <div className="w-full">
          <div className="rounded-lg shadow-md bg-blue-100 text-blue-900 p-6">
            <div className="flex items-center font-bold text-xl mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-2" />
              Su instancia de prueba
            </div>

            <p className="text-sm font-semibold mb-4">Información importante:</p>

            <ul className="list-disc list-inside space-y-1 text-sm mb-4">
              <li>La instancia vence en 3 días.</li>
              <li>No es necesaria tarjeta de crédito o débito.</li>
              <li>La instancia puede eliminarse en cualquier momento por abuso.</li>
              <li>Límite de uso: 10 acciones o solicitudes cada 5 minutos.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default FetchStrapi;