import { useRouter } from 'next/router';
import Layout from '@/components/layout/dashboard';
import LayoutGeneral from '../../layoutGeneral';
import Dashboard from '@/pages/instances/[id]/dashboard/Dashboard';


const InstancePage = () => {
  const router = useRouter();
  const { id } = router.query; // Obtén el id de la ruta

  return (
    <Layout>
      <LayoutGeneral>

        <div className=" bg-white  p-6 mb-6 card-border">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        </div>

        <Dashboard instanceId={id} />
      </LayoutGeneral>
    </Layout>
  );
};

export default InstancePage;
