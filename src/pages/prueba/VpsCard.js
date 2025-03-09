import React from 'react';
import Link from 'next/link';
import {
  Cog6ToothIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import ScreenshotImage from '@/components/interfaz/ScreenshotImage';

const VpsCard = ({
  instanceId,
  instanceName,
  status,
  region,
  vcpus,
  ramMb,
  diskMb,
  ipAddress,
}) => {
  // Formatear RAM y disco para mostrar en GB si es apropiado
  const formatMemory = (mb) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(0)} GB`;
    }
    return `${mb} MB`;
  };

  const formattedRam = formatMemory(ramMb);
  const formattedDisk = formatMemory(diskMb);

  return (
    <div className="flex flex-col md:flex-row md:items-center card-border bg-white p-6 gap-4 w-full mx-auto">
      {/* IMAGEN: Arriba en móvil, izquierda en desktop */}
      <div className="md:w-auto justify-center md:justify-start md:flex hidden w-[130px] h-[80px]">
        <div className="flex items-center justify-center w-[130px] h-[80px] bg-gray-100 rounded">
          <span className="text-3xl font-bold text-gray-400">VPS</span>
        </div>
      </div>

      {/* CENTRO: Datos del VPS */}
      <div className="flex flex-col md:items-start md:justify-center gap-2">
        {/* IP Address con ícono para conectar */}
        <div className="flex items-center font-semibold space-x-2 text-md text-[color:var(--app-primary)]">
          <span className="font-mono">{ipAddress}</span>
          <Link
            href={`ssh://root@${ipAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* Nombre de la instancia */}
        <span className="text-lg font-semibold text-gray-800">
          {instanceName}
        </span>

        {/* Indicador de estado (running/stopped) */}
        {status === "running" ? (
          <div className="flex items-center space-x-2 text-sm mt-1">
            {/* Punto verde + "Running" */}
            <div className="inline-flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-600" />
              <span className="font-semibold text-green-600">Running</span>
            </div>
            {/* Región */}
            <span className="text-gray-500">Región: {region}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-sm mt-1">
            {/* Punto rojo + "Stopped" */}
            <div className="inline-flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-red-600" />
              <span className="font-semibold text-red-600">Stopped</span>
            </div>
            {/* Región */}
            <span className="text-gray-500">Región: {region}</span>
          </div>
        )}

        {/* Especificaciones técnicas */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          <span>vCPUs: {vcpus}</span>
          <span>RAM: {formattedRam}</span>
          <span>Disco: {formattedDisk}</span>
        </div>
      </div>

      {/* BOTONES: Abajo en móvil, derecha en desktop */}
      <div className="flex md:ml-auto mt-2 md:mt-0 gap-4">
        {/* Botón de SSH */}
        <Link href={`ssh://root@${ipAddress}`} passHref className="w-full sm:w-auto">
          <button className="w-full hover:shadow-lg transition-shadow duration-300 border border-gray-200 bg-white text-slate-900 px-6 py-2 rounded-lg text-base font-semibold shadow-md flex items-center justify-center space-x-2">
            <ArrowTopRightOnSquareIcon className="h-6 w-6" />
            <span>SSH</span>
          </button>
        </Link>

        {/* Botón de ajustes */}
        <Link href={`/vps/${instanceId}/dashboard`} passHref className="w-full sm:w-auto">
          <button className="w-full hover:shadow-lg transition-shadow duration-300 border border-gray-200 bg-white text-slate-900 px-6 py-2 rounded-lg text-base font-semibold shadow-md flex items-center justify-center space-x-2">
            <Cog6ToothIcon className="h-6 w-6" />
            <span>Ajustes</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default VpsCard;