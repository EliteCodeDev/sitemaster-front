import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Loader from '../../components/loaders/OrderSkeleton';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useStrapiData } from '../../services/strapiService';

// Importaciones de shadcn (Tabs) y Hero UI (Card)
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardBody } from '@heroui/card';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function SubscriptionPlans() {
  const { data: session } = useSession();
  const email = session?.user?.email || '';

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Obtenemos los datos de la tabla "products" de Strapi
  const { data: products, error, isLoading } = useStrapiData('products');
  console.log(products);
  // Manejo de estados de carga y error
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400">
        Error al cargar los datos: {error.message}
      </div>
    );
  }

  // Filtramos los productos según el período de facturación
  const monthlyProducts = products.filter(
    (product) => product.billing_period?.toLowerCase() === 'mensual'
  );
  const annualProducts = products.filter(
    (product) => product.billing_period?.toLowerCase() === 'anual'
  );

  // Función para redirigir al checkout
  const handleCheckout = (baseUrl) => {
    if (!email) {
      alert('Debes iniciar sesión para continuar.');
      return;
    }
    const checkoutUrl = `${baseUrl}?billing_email=${encodeURIComponent(email)}`;
    setLoading(true);
    setShowModal(true);
    setTimeout(() => {
      setLoading(false);
      setShowModal(false);
      window.location.href = checkoutUrl;
    }, 2000); // Simula un retraso antes de redirigir
  };

  // Renderiza una tarjeta de producto
  const renderProductCard = (product) => {
    return (
      <div
        key={product.id}
        className={classNames(
          product.featured
            ? 'bg-gradient-to-b from-[var(--app-primary)] to-white via-white'
            : 'bg-white',
          'rounded-lg p-8 ring-1 ring-gray-200 xl:p-10'
        )}
      >
        <h3 id={product.id} className="text-gray-900 text-xl font-semibold leading-8">
          {product.name}
        </h3>
        <p className="mt-6 flex items-baseline gap-x-1">
          <span className="text-gray-900 text-4xl font-bold tracking-tight">
            {product.price}
          </span>
        </p>
        <p className="text-gray-600 mt-4 text-sm leading-6">
          {product.billing_period}
        </p>

        <div>
          <button
            onClick={() => handleCheckout(product.url)}
            disabled={loading}
            className={`w-full mt-6 block rounded-md py-3 px-3 text-center text-md font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${loading
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-[var(--app-primary)] text-white shadow-sm hover:bg-[var(--app-primary-hovered)] focus-visible:outline-[var(--app-primary)]'
              }`}
          >
            {loading ? 'Cargando...' : 'Seleccionar plan'}
          </button>

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex justify-center items-center">
                  <div className="w-10 h-10 border-4 border-t-[var(--app-primary)] border-gray-300 rounded-full animate-spin" />
                </div>
                <p className="text-center mt-4">Redirigiendo al checkout...</p>
              </div>
            </div>
          )}
        </div>

        {/* Si deseas mostrar características (features), descomenta:
        <ul role="list" className="mt-8 space-y-3 text-sm leading-6 xl:mt-10 text-black">
          {product.features?.map((feature, index) => (
            <li key={index} className="flex gap-x-3">
              <CheckIcon className="text-[var(--app-primary)] h-6 w-6 flex-none rounded-full bg-[var(--app-primary)] p-1" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul> */}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="text-center">
        <p className="font-semibold tracking-tight text-gray-900 sm:text-4xl text-4xl">
          Elige un plan
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-center text-md leading-8 text-gray-600">
          Encuentra el plan adecuado para ti
        </p>
      </div>

      {/* Tabs de shadcn para mostrar planes mensuales o anuales */}
      <Tabs defaultValue="mensual" className="mt-8" aria-label="Planes">
        <TabsList>
          <TabsTrigger value="mensual">Mensual</TabsTrigger>
          <TabsTrigger value="anual">Anual</TabsTrigger>
        </TabsList>

        {/* Contenido de la pestaña "Mensual" */}
        <TabsContent value="mensual">
          <Card>
            <CardBody>
              {monthlyProducts.length > 0 ? (
                <div className="isolate mx-auto mt-4 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                  {monthlyProducts.map(renderProductCard)}
                </div>
              ) : (
                <p className="mt-4 text-center text-gray-500">
                  No hay planes mensuales disponibles.
                </p>
              )}
            </CardBody>
          </Card>
        </TabsContent>

        {/* Contenido de la pestaña "Anual" */}
        <TabsContent value="anual">
          <Card>
            <CardBody>
              {annualProducts.length > 0 ? (
                <div className="isolate mx-auto mt-4 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                  {annualProducts.map(renderProductCard)}
                </div>
              ) : (
                <p className="mt-4 text-center text-gray-500">
                  No hay planes anuales disponibles.
                </p>
              )}
            </CardBody>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
