import { useRouter } from 'next/router';
import useSWR from 'swr';
import Layout from '@/components/layout/dashboard';
import LayoutGeneral from '../../layoutGeneral';
import Preload from '@/components/loaders/OrderSkeleton';
import Proxy from './proxy';

const fetcher = (url) =>
  fetch(url, {
    headers: {
      apiKey: process.env.NEXT_PUBLIC_WAZEND_API_KEY,
    },
  }).then((res) => res.json());

const InstancePage = () => {
  const router = useRouter();
  const { id } = router.query; // Obtén el id de la ruta

  const { data: instanceData, error } = useSWR(
    id ? `${process.env.NEXT_PUBLIC_WAZEND_API_URL}/instance/fetchInstances?instanceId=${id}` : null,
    fetcher
  );

  return (
    <Layout>
      <LayoutGeneral>

        <div className="card-border bg-white p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Proxy</h2>
        </div>

        {error ? (
          <p>Error: {error.message}</p>
        ) : !instanceData ? (
          <Preload />
        ) : instanceData.length === 0 ? (
          <p>No instance data available</p>
        ) : (
          <>
            <Proxy name={instanceData[0].name} />
          </>
        )}
      </LayoutGeneral>
    </Layout>
  );
};

export default InstancePage;
