import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Loader from '../../components/loaders/OrderSkeleton';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useStrapiData } from '../../services/strapiService';
import { Card, CardBody } from '@heroui/card';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function SubscriptionPlans() {
  const { data: session } = useSession();
  const name = session?.user?.name || '';

  const email = session?.user?.email || '';
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('mensual');

  // Obtenemos los datos de la tabla "products" de Strapi
  const { data: products, error, isLoading } = useStrapiData('products?sort[0]=price:asc');

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

  // Filtramos los productos según el período de facturación seleccionado
  const filteredProducts = products.filter(
    (product) => product.billing_period?.toLowerCase() === billingPeriod
  );

  // Función para redirigir al checkout
  const handleCheckout = (baseUrl) => {
    if (!email) {
      alert('Debes iniciar sesión para continuar.');
      return;
    }
    const checkoutUrl = `${baseUrl}?name=${name}&email=${encodeURIComponent(email)}`;
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
          'relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl h-full',
          product.featured
            ? 'bg-gradient-to-br from-white via-purple-50 to-[var(--app-primary)]/10 shadow-lg'
            : 'bg-white border border-gray-200'
        )}
      >
        {product.featured && (
          <div className="absolute right-0 top-12">
            <div className="relative">
              <div className="bg-[var(--app-primary)] text-white text-xs font-bold py-1 px-3 rounded-l-lg shadow-md">
                Recomendado
              </div>
            </div>
          </div>
        )}

        <div className={classNames(
          product.featured ? 'border-b-2 border-[var(--app-primary)]/30' : 'bg-gray-100',
          'p-4'
        )}>
          <h3 id={product.id} className="text-xl font-bold text-center text-gray-900">
            {product.name}
          </h3>
        </div>

        <div className="p-6">
          <div className="flex justify-center">
            <p className="flex items-baseline">
              <span className={classNames(
                product.featured ? 'text-[var(--app-primary)]' : 'text-gray-900',
                'text-4xl font-bold tracking-tight'
              )}>
                ${product.price}/mes
              </span>
            </p>
          </div>

          <p className="text-gray-600 mt-2 text-sm text-center font-medium">
            {product.billing_period}
          </p>

          {/* Si deseas mostrar características (features), descomenta: */}
          <div className="mt-6 space-y-4">
            {product.features?.map((feature, index) => (
              <div key={index} className="flex items-start">
                <CheckIcon
                  className={classNames(
                    product.featured ? 'text-[var(--app-primary)]' : 'text-green-500',
                    'h-5 w-5 flex-shrink-0 mt-0.5'
                  )}
                  aria-hidden="true"
                />
                <span className="ml-3 text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={() => handleCheckout(product.url)}
              disabled={loading}
              className={`w-full block rounded-lg py-3 px-3 text-center text-md font-semibold leading-6 transition-all duration-200 ${loading
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : product.featured
                  ? 'bg-[var(--app-primary)] text-white shadow-md hover:shadow-lg hover:bg-[var(--app-primary)]/90'
                  : 'bg-white text-[var(--app-primary)] border border-[var(--app-primary)] hover:bg-[var(--app-primary)]/5'
                }`}
            >
              {loading ? 'Cargando...' : 'Seleccionar plan'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="font-bold text-gray-900 text-4xl mb-3">
          Elige un plan
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Encuentra el plan adecuado para ti
        </p>
      </div>

      {/* Selector de período de facturación estilizado */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex px-1.5 rounded-full bg-white shadow-inner">
          <button
            onClick={() => setBillingPeriod('mensual')}
            className={`px-8 py-3 text-md font-medium rounded-full transition-all ${billingPeriod === 'mensual'
              ? 'bg-[var(--app-primary)] text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-200'
              }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBillingPeriod('anual')}
            className={`px-8 py-3 text-md font-medium rounded-full transition-all ${billingPeriod === 'anual'
              ? 'bg-[var(--app-primary)] text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-200'
              }`}
          >
            Anual
          </button>
        </div>
      </div>

      {/* Contenedor de tarjetas sin fondo, en grid responsivo */}
      <div className="bg-transparent pb-6 w-full mx-auto">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {filteredProducts.map(renderProductCard)}
          </div>
        ) : (
          <div className="text-center py-10 rounded-lg bg-gray-50 max-w-md mx-auto">
            <p className="text-gray-500 text-lg">
              No hay planes {billingPeriod}es disponibles.
            </p>
          </div>
        )}
      </div>

      {/* Modal de carga */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl">
            <div className="flex justify-center items-center">
              <div className="w-12 h-12 border-4 border-t-[var(--app-primary)] border-gray-200 rounded-full animate-spin" />
            </div>
            <p className="text-center mt-6 text-gray-800 font-medium">Redirigiendo al checkout...</p>
          </div>
        </div>
      )}
    </div>
  );
}