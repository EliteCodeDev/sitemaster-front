{/* <FetchWebsites />
import useSWR from "swr"
import { useSession } from "next-auth/react"
import WebsiteCard from "./websiteCard"
import OrderSkeleton from "../../components/loaders/OrderSkeleton"
import Link from "next/link"
import { PlusIcon } from "@heroicons/react/24/solid"

import { strapiUrl } from "@/routes/routes"
import Cbutton from "@/components/interfaz/Cbutton"

const fetcher = async (url, jwt) => {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })

    if (!response.ok) {
      throw new Error(`❌ Error en la solicitud: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("❌ Error al obtener datos de Strapi:", error)
    throw error
  }
}

const FetchWebsites = () => {
  const { data: session } = useSession()
  const jwt = session?.jwt

  const { data, error, isLoading } = useSWR(jwt ? `${strapiUrl}/api/users/me?populate=websites` : null, (url) =>
    fetcher(url, jwt),
  )

  if (isLoading) {
    return <OrderSkeleton />
  }

  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>
  }

  if (!data) return <OrderSkeleton />

  if (!data?.websites?.length) {
    return (
      <>
        <div className="bg-white px-6 py-10 text-center w-full mx-auto min-h-[400px] flex flex-col justify-center items-center card-border">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-800">¡Suscribete y crea tu primer website en sitemaster!</h3>
          da
          <p className="mt-2 text-sm text-gray-600">Comience contratando uno de nuestros planes.</p>
          <Link href="/upgrade/" className="mt-5">
            <Cbutton classType={"primary"} startContent={<PlusIcon className="w-5" />}>
              <span>Crea un website</span>
            </Cbutton>
          </Link>
        </div>
      </>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.websites.map((website, index) => (
        <WebsiteCard
          key={index}
          websiteId={website.websiteId}
          websiteName={website.websiteName}
          isActive={website.isActive}
          endDate={website.endDate}
          serverUrl={website.server_url}
        />
      ))}
    </div>
  )
}

export default FetchWebsites


*/}

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import WebsiteCard from './websiteCard';
import OrderSkeleton from '../../components/loaders/OrderSkeleton';
import Link from 'next/link';
import { format } from "date-fns";
import { PlusIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetcher = async (url, jwt) => {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error(`❌ Error en la solicitud: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error al obtener datos de Strapi:', error);
    throw error;
  }
};

const FetchWebsites = () => {
  const { data: session } = useSession();
  const jwt = session?.jwt;

  const { data, error, isLoading } = useSWR(
    jwt ? `${strapiUrl}/api/users/me?populate[subscriptions][populate]=websites` : null,
    (url) => fetcher(url, jwt)
  );

  if (isLoading) {
    return <OrderSkeleton />;
  }

  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  if (!data) return <OrderSkeleton />;

  // Verificar si hay alguna suscripción con sitios web
  const hasWebsites = data?.subscriptions?.some(sub => sub.websites?.length > 0);

  if (!hasWebsites) {
    return (
      <div className="bg-white rounded-xl px-6 py-10 text-center shadow-lg w-full mx-auto border border-gray-200 min-h-[400px] flex flex-col justify-center items-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-800">
          ¡Suscribete y crea tu primer sitio web con nosotros!
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Comience contratando uno de nuestros planes web.
        </p>
        <Link
          href="/websites/upgrade/"
          className="mt-6 inline-flex items-center rounded-lg bg-emerald-600 px-5 py-3 text-white text-base font-medium shadow-md hover:bg-emerald-500 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          <PlusIcon className="h-6 w-6" aria-hidden="true" />
          <span className="ml-3">Crear un sitio web</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.subscriptions
        .filter(sub => sub.websites?.length > 0)
        .sort((a, b) => (a.status_woo === "active" ? -1 : 1)) // Ordena los activos primero
        .map((sub, index) => (
          <div key={index}>
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              {sub.status_woo === "active" ? (
                <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
              ) : (
                <XCircleIcon className="w-6 h-6 text-red-500" />
              )}
              Suscripción #{sub.id_woo || sub.id_hotmart || 'N/A'}
            </h2>

            <p className="text-sm text-gray-600">
              Próximo pago:{" "}
              <span className="font-medium">
                {sub.next_payment_date_gmt
                  ? format(new Date(sub.next_payment_date_gmt), "dd/MM/yyyy")
                  : "Sin fecha"}
              </span>
            </p>

            {sub.websites?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 mt-4">
                {sub.websites.map((website, idx) => (
                  <WebsiteCard
                    key={idx}
                    websiteId={website.websiteId}
                    websiteName={website.websiteName}
                    isActive={website.isActive}
                    endDate={sub.next_payment_date_gmt || website.endDate}
                    serverUrl={website.server_url}
                    purpose={website.purpose}
                    description={website.description}
                    domainName={website.domainName}
                    domainExtension={website.domainExtension}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">Esta suscripción no tiene sitios web asociados.</p>
            )}
          </div>
        ))}
    </div>
  );
};

export default FetchWebsites;