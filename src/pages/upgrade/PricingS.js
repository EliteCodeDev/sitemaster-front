import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Loader from '../../components/loaders/OrderSkeleton';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useStrapiData } from '../../services/strapiService';

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
  const { data: products, error, isLoading } = useStrapiData(
    'products?sort[0]=price:asc'
  );

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
    const checkoutUrl = `${baseUrl}?name=${name}&email=${encodeURIComponent(
      email
    )}`;
    setLoading(true);
    setShowModal(true);
    setTimeout(() => {
      setLoading(false);
      setShowModal(false);
      window.location.href = checkoutUrl;
    }, 2000);
  };

  // Renderiza una tarjeta de producto con encabezado blanco, cuerpo gris y pie blanco
  const renderProductCard = (product) => {
    return (
      <div
        key={product.id}
        className="relative border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden"
      >
        {/* Etiqueta “Recomendado” si es featured, a la altura anterior (top-12) */}
        {product.featured && (
          <div className="absolute right-0 top-12">
            <div className="relative">
              <div className="bg-[var(--app-primary)] text-white text-xs font-bold py-1 px-3 rounded-l-lg shadow-md">
                Recomendado
              </div>
            </div>
          </div>
        )}

        {/* Encabezado blanco con separador (borde inferior) */}
        <div className="bg-white p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-center text-gray-900">
            {product.name}
          </h3>
        </div>

        {/* Cuerpo en gris: precio, período, features */}
        <div className="p-4 bg-gray-50 flex-grow flex flex-col justify-center">
          {/* Precio centrado */}
          <div className="flex justify-center mb-2">
            <span
              className={classNames(
                product.featured ? 'text-[var(--app-primary)]' : 'text-gray-900',
                'text-4xl font-bold tracking-tight'
              )}
            >
              ${product.price}/mes
            </span>
          </div>

          {/* Período de facturación */}
          <p className="text-gray-600 text-sm text-center font-medium mb-4">
            {product.billing_period}
          </p>

          {/* Lista de features (si es un array) */}
          {Array.isArray(product.features) && product.features.length > 0 && (
            <div className="space-y-2">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-start justify-center">
                  <CheckIcon
                    className={classNames(
                      product.featured
                        ? 'text-[var(--app-primary)]'
                        : 'text-green-500',
                      'h-5 w-5 flex-shrink-0 mt-0.5'
                    )}
                    aria-hidden="true"
                  />
                  <span className="ml-2 text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pie blanco con el botón */}
        <div className="p-4 bg-white">
          <button
            onClick={() => handleCheckout(product.url)}
            disabled={loading}
            className={classNames(
              'w-full rounded-lg py-2 text-md font-semibold leading-6 transition-all duration-200',
              loading
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : product.featured
                ? 'bg-[var(--app-primary)] text-white hover:bg-[var(--app-primary)]/90'
                : 'bg-white text-[var(--app-primary)] border border-[var(--app-primary)] hover:bg-[var(--app-primary)]/5'
            )}
          >
            {loading ? 'Cargando...' : 'Seleccionar plan'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="font-bold text-gray-900 text-4xl mb-3">Elige un plan</h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Encuentra el plan adecuado para ti
        </p>
      </div>

      {/* Selector de período de facturación estilizado */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex px-1.5 rounded-full bg-white shadow-inner">
          <button
            onClick={() => setBillingPeriod('mensual')}
            className={classNames(
              'px-8 py-3 text-md font-medium rounded-full transition-all',
              billingPeriod === 'mensual'
                ? 'bg-[var(--app-primary)] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-200'
            )}
          >
            Mensual
          </button>
          <button
            onClick={() => setBillingPeriod('anual')}
            className={classNames(
              'px-8 py-3 text-md font-medium rounded-full transition-all',
              billingPeriod === 'anual'
                ? 'bg-[var(--app-primary)] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-200'
            )}
          >
            Anual
          </button>
        </div>
      </div>

      {/* Grid de tarjetas */}
      <div className="bg-transparent pb-6 w-full mx-auto">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
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
            <p className="text-center mt-6 text-gray-800 font-medium">
              Redirigiendo al checkout...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
