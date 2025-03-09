import React from 'react';
import Link from 'next/link';
import {
  Cog6ToothIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

const WebsiteCard = ({
  websiteId,
  websiteName,
  statusWoo,
  endDate,
  serverUrl,       
  purpose,         
  description,     
  domainName,
  domainExtension,
}) => {
  // Dominio completo (p.ej. "midominio.com")
  const fullDomain =
    domainName && domainExtension
      ? `${domainName}.${domainExtension}`
      : 'No configurado';

  // Fecha de renovación en formato "Apr 7, 2025"
  const renewalDate = endDate
    ? new Date(endDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No definido';

  return (
    <div className="flex items-center bg-white rounded-md shadow-md gap-4 p-6">
      {/* IZQUIERDA: Placeholder confetti o imagen */}
      <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-orange-200">
      </div>

      {/* CENTRO: Datos del sitio */}
      <div className="flex flex-col">

        {/* Dominio con ícono para abrir en nueva pestaña */}
        <div className="flex items-center font-semibold space-x-2 text-md text-[color:var(--app-primary)]">
          <Link
            href={`https://${fullDomain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {fullDomain}
          </Link>
          <Link
            href={`https://${fullDomain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* Nombre del sitio */}
        <span className="text-base font-semibold text-gray-800">
          {websiteName}
        </span>

        {/* Indicador de estado (Activo/Inactivo) y fecha de renovación */}
        {statusWoo ? (
          <div className="flex items-center space-x-2 text-sm mt-1">
            {/* Punto verde + "Activo" */}
            <div className="inline-flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-600" />
              <span className="font-semibold text-green-600">Activo</span>
            </div>
            {/* Fecha de renovación */}
            <span className="text-gray-500">Expira {renewalDate}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-sm mt-1">
            {/* Punto rojo + "Inactivo" */}
            <div className="inline-flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-red-600" />
              <span className="font-semibold text-red-600">Inactivo</span>
            </div>
          </div>
        )}
      </div>

      {/* DERECHA: Botones (Abrir / Ajustes o Expirado) */}
      <div className="ml-auto flex space-x-2">
        {/* Botón de abrir */}
        <Link href={`https://${fullDomain}`} passHref>
          <button className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 bg-white text-slate-900 px-6 py-2 rounded-lg text-base font-semibold shadow-md flex items-center justify-center space-x-2">
            <ArrowTopRightOnSquareIcon className="h-6 w-6" />
            <span>Abrir</span>
          </button>
        </Link>

        {/* Botón de ajustes o mensaje de expirado */}
        {statusWoo ? (
          <Link href={`/websites/${websiteId}/dashboard`} passHref>
            <button className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 bg-white text-slate-900 px-6 py-2 rounded-lg text-base font-semibold shadow-md flex items-center justify-center space-x-2">
              <Cog6ToothIcon className="h-6 w-6" />
              <span>Ajustes</span>
            </button>
          </Link>
        ) : (
          <span className="text-base font-semibold bg-red-500 text-white px-6 py-2 rounded-lg">
            Tu servicio expiró.
          </span>
        )}
      </div>
    </div>
  );
};

export default WebsiteCard;
