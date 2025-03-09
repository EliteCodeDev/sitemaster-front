import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Loader from '../../components/loaders/OrderSkeleton';
import { VideoCameraIcon, PhoneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { useStrapiData } from '../../services/strapiService';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Supports() {
  const { data: session } = useSession();

  // Obtenemos los datos de la tabla "supports" de Strapi
  const { data: supports, error, isLoading } = useStrapiData('suports');

  // Estados para el manejo de la carga
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  // Función para obtener el icono según el tipo
  const getIconByType = (iconType) => {
    switch (iconType?.toLowerCase()) {
      case 'video':
        return <VideoCameraIcon className="h-10 w-10 text-[var(--app-primary)]" />;
      case 'phone':
        return <PhoneIcon className="h-10 w-10 text-[var(--app-primary)]" />;
      case 'chat':
        return <ChatBubbleLeftRightIcon className="h-10 w-10 text-[var(--app-primary)]" />;
      case 'mail':
        return <EnvelopeIcon className="h-10 w-10 text-[var(--app-primary)]" />;
      default:
        return <ChatBubbleLeftRightIcon className="h-10 w-10 text-[var(--app-primary)]" />;
    }
  };

  // Manejar clic en botón
  const handleButtonClick = (url) => {
    if (url.startsWith('http') || url.startsWith('https') || url.startsWith('mailto') || url.startsWith('tel')) {
      // Para URLs externas, abrimos en nueva pestaña
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // Para URLs internas, mostramos loader y redirigimos
      setLoading(true);
      setShowModal(true);
      setTimeout(() => {
        setLoading(false);
        setShowModal(false);
        window.location.href = url;
      }, 1000);
    }
  };

  // Renderizar una tarjeta de soporte
  const renderSupportCard = (support) => {
    return (
      <div
        key={support.id}
        className={classNames(
          'relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col',
          support.featured
            ? 'bg-gradient-to-br from-white via-purple-50 to-[var(--app-primary)]/10 shadow-lg'
            : 'bg-white border border-gray-200'
        )}
      >
        {support.featured && (
          <div className="absolute right-0 top-12">
            <div className="relative">
              <div className="bg-[var(--app-primary)] text-white text-xs font-bold py-1 px-3 rounded-l-lg shadow-md">
                Recomendado
              </div>
            </div>
          </div>
        )}

        <div className={classNames(
          support.featured ? 'border-b-2 border-[var(--app-primary)]/30' : 'bg-gray-100',
          'p-4'
        )}>
          <h3 id={support.id} className="text-xl font-bold text-center text-gray-900">
            {support.name}
          </h3>
        </div>

        <div className="p-6 flex-grow flex flex-col">
          <div className="flex justify-center mb-4">
            {getIconByType(support.icon)}
          </div>

          <p className="text-gray-600 text-center mb-4">
            {support.description}
          </p>

          <div className="mt-auto pt-6">
            {support.price && (
              <p className="mb-4 text-sm font-medium text-center text-gray-500">
                Desde {support.price}
              </p>
            )}

            <button
              onClick={() => handleButtonClick(support.url)}
              disabled={loading}
              className="w-full block rounded-lg py-3 px-3 text-center text-md font-semibold leading-6 transition-all duration-200 bg-[var(--app-primary)] text-white shadow-md hover:shadow-lg hover:bg-[var(--app-primary)]/90 disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed"
            >
              {loading ? 'Cargando...' : support.buttonText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="font-bold text-gray-900 text-4xl mb-3">
          Nuestros canales de soporte
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Encuentra la ayuda que necesitas a través de nuestros diferentes canales
        </p>
      </div>

      {/* Contenedor de tarjetas sin fondo, en grid responsivo */}
      <div className="bg-transparent pb-6 w-full mx-auto">
        {supports && supports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {supports.map(renderSupportCard)}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No hay canales de soporte disponibles en este momento.</p>
          </div>
        )}
      </div>

      {/* Modal de carga */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex justify-center items-center">
              <div className="w-10 h-10 border-4 border-t-[var(--app-primary)] border-gray-300 rounded-full animate-spin" />
            </div>
            <p className="text-center mt-4">Procesando solicitud...</p>
          </div>
        </div>
      )}
    </div>
  );
}