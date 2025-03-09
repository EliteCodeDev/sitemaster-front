'use client';
import { useState, useEffect } from 'react';
import VpsCard from './VpsCard';
import Layout from '@/components/layout/dashboard';
import OrderSkeleton from '../../components/loaders/OrderSkeleton';


export default function ContaboInstances() {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInstances() {
      try {
        setLoading(true);
        const response = await fetch('/api/contabo');

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setInstances(data.data || []);
      } catch (err) {
        console.error('Error al obtener instancias:', err);
        setError('No se pudieron cargar las instancias. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchInstances();
  }, []);

  // if (loading) return <Layout><div className="p-4">Cargando instancias...</div></Layout>;
  if (loading) return <Layout><OrderSkeleton /></Layout>;
  if (error) return <Layout><div className="p-4 text-red-500">{error}</div></Layout>;

  return (
    <Layout title="Tus VPS" >
      {instances.length === 0 ? (
        <p>No se encontraron instancias.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {instances.map((instance) => (
            <VpsCard
              key={instance.instanceId}
              instanceId={instance.instanceId}
              instanceName={instance.name || `vmi${instance.instanceId}`}
              status={instance.status}
              region={instance.region}
              vcpus={instance.cpuCores}
              ramMb={instance.ramMb}
              diskMb={instance.diskMb}
              diskType={instance.productType}
              ipAddress={instance.ipConfig?.v4?.ip || 'N/A'}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}