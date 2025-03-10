'use client';
import { useState, useEffect } from 'react';
import VpsCard from './VpsCard';
import Layout from '@/components/layout/dashboard';
import OrderSkeleton from '../../components/loaders/OrderSkeleton';
import { useSession } from 'next-auth/react';

export default function ContaboInstances() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [vpsData, setVpsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();

  console.log('Sesión:', session);

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        setLoading(true);

        // Asegurarse de que la sesión está disponible
        if (status === "authenticated" && session) {
          // Extraer JWT de la sesión
          // La ubicación exacta depende de cómo está configurado NextAuth.js
          const jwt = session.jwt ||
            (session.user && session.user.jwt) ||
            session.accessToken ||
            (session.user && session.user.accessToken);

          console.log('JWT disponible:', !!jwt);

          if (!jwt) {
            console.error('No se encontró JWT en la sesión:', session);
            setError('No se encontró el token de autenticación.');
            setLoading(false);
            return;
          }

          // Pasar JWT al API
          const response = await fetch('/api/contabo', {
            headers: {
              'Authorization': `Bearer ${jwt}`
            }
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const responseData = await response.json();
          console.log('Respuesta de API:', responseData);

          // Guardar las suscripciones
          setSubscriptions(responseData.userData.subscriptions || []);

          // Guardar los datos específicos de VPS
          setVpsData(responseData.data || []);
        } else if (status === "unauthenticated") {
          setError('Por favor, inicia sesión para ver tus instancias.');
        }
      } catch (err) {
        console.error('Error al obtener suscripciones:', err);
        setError('No se pudieron cargar las suscripciones. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }

    if (status !== "loading") {
      fetchSubscriptions();
    }
  }, [session, status]);

  // Función para buscar datos específicos de VPS por instanceId
  const findVpsDetails = (instanceId) => {
    //convertir instanceId a number
    const id = parseInt(instanceId);
    return vpsData.find(vps => vps.instanceId === id) || {};
  };

  if (loading) return <Layout><OrderSkeleton /></Layout>;
  if (error) return <Layout><div className="p-4 text-red-500">{error}</div></Layout>;

  return (
    <Layout title="Tus Servicios VPS">
      {subscriptions.length === 0 ? (
        <p>No se encontraron suscripciones activas.</p>
      ) : (
        <div className="space-y-8">
          {subscriptions
            .filter(subscription => subscription.vps_service)
            .map((subscription) => {
              // Buscar datos específicos para este VPS
              const vpsDetails = findVpsDetails(subscription.vps_service.instanceId);
              console.log('Detalles de VPS:', vpsDetails);
              return (
                <div key={subscription.id} className="bg-white card-border p-0 overflow-hidden">
                  <div className="border-b bg-gray-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="text-lg font-semibold text-gray-800">
                        Suscripción #{subscription.id_woo}
                      </h2>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium 
                        ${subscription.status_woo === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {subscription.status_woo}
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Precio:</span>
                        <span className="ml-1">${subscription.total} / {subscription.billing_period}</span>
                      </div>
                      <div>
                        <span className="font-medium">Próximo pago:</span>
                        <span className="ml-1">
                          {subscription.next_payment_date_gmt ?
                            new Date(subscription.next_payment_date_gmt).toLocaleDateString() :
                            'N/A'}
                        </span>
                      </div>
                      {subscription.trial_end_date_gmt && new Date(subscription.trial_end_date_gmt) > new Date() && (
                        <div>
                          <span className="font-medium">Fin periodo prueba:</span>
                          <span className="ml-1">
                            {new Date(subscription.trial_end_date_gmt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="">
                    <VpsCard
                      documentId={subscription.vps_service.documentId}
                      instanceId={subscription.vps_service.instanceId}
                      instanceName={vpsDetails.displayName || subscription.vps_service.instanceName || `VPS-${subscription.id_woo}`}
                      status={vpsDetails.status || subscription.vps_service.status || 'unknown'}
                      region={vpsDetails.region || subscription.vps_service.region || 'No disponible'}
                      vcpus={vpsDetails.cpuCores || subscription.vps_service.cpuCores || 0}
                      ramMb={vpsDetails.ramMb || subscription.vps_service.ramMb || 0}
                      diskMb={vpsDetails.diskMb || subscription.vps_service.diskMb || 0}
                      diskType={vpsDetails.diskType || subscription.vps_service.diskType || 'disco'}
                      ipAddress={vpsDetails.ipAddress || vpsDetails.ip || subscription.vps_service.ipAddress || subscription.vps_service.ip || 'N/A'}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </Layout>
  );
}