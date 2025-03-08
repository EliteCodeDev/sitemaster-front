import { useState } from 'react';
import Link from 'next/link';
import {
  GlobeAltIcon,
  Cog6ToothIcon,
  EyeIcon,
  EyeSlashIcon,
  ClipboardIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';

const WebsiteCard = ({ websiteId, websiteName, isActive, endDate, serverUrl, purpose, description, domainName, domainExtension }) => {
  const [visibleKey, setVisibleKey] = useState(false);
  const [apiKey, setApiKey] = useState('**********-****-****-****-************');

  const toggleKeyVisibility = () => {
    setVisibleKey(!visibleKey);
  };

  const copyToClipboard = () => {
    if (apiKey && apiKey !== '**********-****-****-****-************') {
      navigator.clipboard.writeText(apiKey);
      toast.success('API Key copiada al portapapeles.');
    }
  };

  const fullDomain = domainName && domainExtension ? `${domainName}${domainExtension}` : "No configurado";

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md p-6 gap-4 card-border">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-lg font-bold">{websiteName}</p>
      </div>

      {/* API Key con íconos de ojo y copiar */}
      {/*
      <div className="bg-gray-200 p-3 rounded-sm flex items-center justify-between">
        <p className="text-black text-sm font-mono">
          {visibleKey ? apiKey : '**********-****-****-****-************'}
        </p>
        <div className="flex space-x-4">
          <button onClick={toggleKeyVisibility} className="text-gray-500 hover:text-gray-700">
            {visibleKey ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
          <button onClick={copyToClipboard} className="text-gray-500 hover:text-gray-700">
            <ClipboardIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      */}

      {/* Datos del sitio web */}
      <div className="group block flex-shrink-0">
        <Link href={`https://${fullDomain}`} passHref>
          <div className="bg-gray-200 p-3 rounded-sm flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex h-10 w-10 rounded-full bg-emerald-200 items-center justify-center">
                <GlobeAltIcon className="h-7 w-10 text-emerald-600" />
              </div>
              <div className="ml-3">
                <p className="text-md font-semibold text-black">{fullDomain}</p>
                <p className="text-sm font-base text-gray-500">
                  {purpose || "Propósito no definido"}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Descripción */}
      {description && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
      )}

      {/* Estado y botones: Abrir y Ajustes juntos */}
      <div className="mt-4 flex justify-between items-center">
        <p
          className={`text-sm font-semibold px-3 py-1 rounded-2xl text-white ${isActive ? "bg-green-600" : "bg-red-600"
            }`}
        >
          {isActive ? "Activo" : "Inactivo"}
        </p>
        <div className="flex gap-4">
          {/* Botón de abrir con Link funcional */}
          <Link href={`https://${fullDomain}`} passHref>
            <button className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 bg-white text-slate-900 px-6 py-2 rounded-lg text-base font-semibold shadow-md flex items-center justify-center space-x-2">
              <ArrowTopRightOnSquareIcon className="h-6 w-6" />
              <span>Abrir</span>
            </button>
          </Link>

          {/* Botón de ajustes con Link funcional */}
          {isActive ? (
            <Link href={`/websites/${websiteId}/dashboard`} passHref>
              <button className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 bg-white text-slate-900 px-6 py-2 rounded-lg text-base font-semibold shadow-md flex items-center justify-center space-x-2">
                <Cog6ToothIcon className="h-6 w-6" />
                <span>Ajustes</span>
              </button>
            </Link>
          ) : (
            <span className="text-base font-semibold bg-red-500 text-white px-6 py-2 rounded-lg">Tu servicio expiró.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteCard;