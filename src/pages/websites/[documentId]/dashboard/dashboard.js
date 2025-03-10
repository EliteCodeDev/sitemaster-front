// src/pages/websites/[documentId]/dashboard/dashboard.js
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Preload from '@/components/loaders/OrderSkeleton';
import { toast } from 'sonner';
import {
  GlobeAltIcon,
  DocumentTextIcon,
  TagIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const fetcher = async (url) => {
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        'Content-Type': 'application/json',
      },  
    });
    if (!res.ok) throw new Error(`Error: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export default function Dashboard({ documentId }) {
  // Se usa el endpoint de Strapi para filtrar por documentId
  const { data, error } = useSWR(
    documentId ? `${strapiUrl}/api/websites?filters[documentId][$eq]=${documentId}&populate=*` : null,
    fetcher
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <h1 className="text-xl font-bold text-red-700 mb-2">Error</h1>
      <p className="text-red-600">{error.message}</p>
    </div>
  );
  
  if (!data) return <Preload />;

  // data.data es un array; se toma el primer elemento y sus atributos
  const website = data.data && data.data.length > 0 ? data.data[0] : null;
  if (!website) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h1 className="text-xl font-bold text-yellow-700 mb-2">No encontrado</h1>
        <p className="text-yellow-600">No se encontró website para documentId: {documentId}</p>
      </div>
    );
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText(website.apiKey);
    toast.success('API Key copiada al portapapeles.');
  };

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Información del Website</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <TagIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Nombre del Website</p>
              <p className="font-medium">{website.websiteName}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <GlobeAltIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Dominio</p>
              <p className="font-medium">{website.domainName}{website.domainExtension}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Descripción</p>
              <p className="font-medium">{website.description || 'Sin descripción'}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <TagIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Propósito</p>
              <p className="font-medium">{website.purpose || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-start space-x-3">
            <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Document ID</p>
              <p className="font-mono text-sm">{documentId}</p>
            </div>
          </div>
        </div>
      </div>

      {website.apiKey && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">API Key</h3>
          
          <div className="flex items-center border border-gray-200 rounded-md bg-gray-50 p-3">
            <div className="flex-1 font-mono text-sm text-green-600 overflow-x-auto py-1 whitespace-nowrap">
              {website.apiKey}
            </div>
            <button
              onClick={copyApiKey}
              className="ml-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              <ClipboardDocumentIcon className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">Esta API Key te permite acceder a los servicios de tu website. Mantenla segura.</p>
        </div>
      )}
    </section>
  );
}