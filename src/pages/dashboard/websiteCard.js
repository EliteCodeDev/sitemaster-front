import React from 'react';
import Link from 'next/link';
import {
  Cog6ToothIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import ScreenshotImage from '@/components/interfaz/ScreenshotImage';

const WebsiteCard = ({
  websiteId,
  websiteName,
  statusWoo,         // true/false según tu lógica
  isActived,         // 'in progress' u otro valor
  endDate,
  serverUrl,
  purpose,
  description,
  domainName,
  domainExtension,
}) => {
  // Tomamos serverUrl como dominio, o "No configurado"
  const fullDomain = serverUrl || 'No configurado';

  // Fecha de renovación
  const renewalDate = endDate
    ? new Date(endDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No definido';

  return (
    <div className="flex flex-col md:flex-row md:items-center card-border bg-white p-6 gap-4 w-full mx-auto">
      {/* IMAGEN: Arriba en móvil, izquierda en desktop */}
      <div className="w-full md:w-auto justify-center md:justify-start md:flex hidden">
        <ScreenshotImage
          url={`https://${fullDomain.replace(/^https?:\/\//, '')}`}
          className="rounded bg-cover bg-center"
          width={130}
          height={80}
          alt={`https://${fullDomain}`}
          fallbackImg="/images/default-website.jpeg"
        />
      </div>

      {/* CENTRO: Datos del sitio */}
      <div className="flex flex-col md:items-start md:justify-center">
        {/* Dominio */}
        <div className="flex items-center font-semibold space-x-2 text-md text-[color:var(--app-primary)]">
          <Link
            href={`https://${fullDomain.replace(/^https?:\/\//, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {fullDomain}
          </Link>
          <Link
            href={`https://${fullDomain.replace(/^https?:\/\//, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* Nombre del sitio */}
        <span className="text-lg font-semibold text-gray-800">
          {websiteName}
        </span>

        {/* ESTADO (según isActived y statusWoo) */}
        {isActived === 'progress' ? (
          // Mostrar "En progreso" en amarillo
          <div className="flex items-center space-x-2 text-sm mt-1">
            <div className="inline-flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-400" />
              <span className="font-semibold text-yellow-500">
                En progreso
              </span>
            </div>
          </div>
        ) : statusWoo ? (
          // Mostrar "Activo" en verde + fecha de expiración
          <div className="flex items-center space-x-2 text-sm mt-1">
            <div className="inline-flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-600" />
              <span className="font-semibold text-green-600">Activo</span>
            </div>
            <span className="text-gray-500">Expira {renewalDate}</span>
          </div>
        ) : (
          // Mostrar "Inactivo" en rojo
          <div className="flex items-center space-x-2 text-sm mt-1">
            <div className="inline-flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-red-600" />
              <span className="font-semibold text-red-600">Inactivo</span>
            </div>
          </div>
        )}
      </div>

      {/* BOTONES: Abajo en móvil, derecha en desktop */}
      <div className="flex md:ml-auto mt-2 md:mt-0 gap-4">
        {/* Si está en progreso, solo mostrar "Configuración" */}
        {isActived === 'progress' ? (
          <button className="w-full sm:w-auto hover:shadow-lg transition-shadow duration-300 border border-gray-200 bg-yellow-50 text-yellow-700 px-6 py-2 rounded-lg text-base font-semibold shadow-md flex items-center justify-center space-x-2">
            <Cog6ToothIcon className="h-6 w-6" />
            <span>Configuración</span>
          </button>
        ) : (
          <>
            {/* Botón de abrir */}
            <Link
              href={`https://${fullDomain.replace(/^https?:\/\//, '')}`}
              passHref
              className="w-full sm:w-auto"
            >
              <button className="w-full hover:shadow-lg transition-shadow duration-300 border border-gray-200 bg-white text-slate-900 px-6 py-2 rounded-lg text-base font-semibold shadow-md flex items-center justify-center space-x-2">
                <ArrowTopRightOnSquareIcon className="h-6 w-6" />
                <span>Abrir</span>
              </button>
            </Link>

            {/* Botón de ajustes o mensaje de expirado */}
            {statusWoo ? (
              <Link
                href={`/websites/${websiteId}/dashboard`}
                passHref
                className="w-full sm:w-auto"
              >
                <button className="w-full hover:shadow-lg transition-shadow duration-300 border border-gray-200 bg-white text-slate-900 px-6 py-2 rounded-lg text-base font-semibold shadow-md flex items-center justify-center space-x-2">
                  <Cog6ToothIcon className="h-6 w-6" />
                  <span>Ajustes</span>
                </button>
              </Link>
            ) : (
              <span className="w-full sm:w-auto text-center text-base font-semibold bg-red-500 text-white px-6 py-2 rounded-lg">
                Tu servicio expiró.
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WebsiteCard;
