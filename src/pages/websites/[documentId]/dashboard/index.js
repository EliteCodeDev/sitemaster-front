// src/pages/websites/[documentId]/dashboard/index.js
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/layout/dashboard';
import LayoutWebsite from '../layoutGeneral';
import Dashboard from './dashboard';

export default function WebsiteDashboardIndex() {
  const router = useRouter();
  const { documentId } = router.query;

  return (
    <Layout>
      <Head>
        <title>Dashboard de Website - Panel de Control</title>
      </Head>

      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard de Website</h1>
          <p className="text-gray-600 mt-1">Gestiona y visualiza la información de tu website.</p>
        </div>

        <LayoutWebsite>
          <Dashboard documentId={documentId} />
        </LayoutWebsite>
      </div>
    </Layout>
  );
}