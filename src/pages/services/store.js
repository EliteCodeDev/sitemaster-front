import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Loader from '../../components/loaders/OrderSkeleton';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useStrapiData } from '../../services/strapiService';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Example() {
    const { data: session } = useSession();
    const email = session?.user?.email || '';
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Obtenemos los datos de la tabla "products" de Strapi
    const { data: products, error, isLoading } = useStrapiData('products');

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

    return (
        <div>
            <div className="mx-auto max-w-4xl text-center">
                <p className="font-semibold tracking-tight text-gray-900 sm:text-4xl text-4xl">Elige un plan</p>
            </div>
            <p className="mx-auto mt-3 max-w-2xl text-center text-md leading-8 text-gray-600">
                Encuentra el plan adecuado para ti
            </p>
            <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                {products.map((product) => (
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
                            {product.description}
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
                        <ul role="list" className="mt-8 space-y-3 text-sm leading-6 xl:mt-10 text-black">
                            {product.features?.map((feature, index) => (
                                <li key={index} className="flex gap-x-3">
                                    <CheckIcon className="text-[var(--app-primary)] h-6 w-6 flex-none rounded-full bg-[var(--app-primary)] p-1" aria-hidden="true" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
