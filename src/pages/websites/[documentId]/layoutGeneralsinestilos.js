// src/pages/websites/[documentId]/layoutGeneral.js
import { CommandLineIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon, Cog6ToothIcon, DocumentTextIcon, SignalIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';

export default function LayoutWebsite({ children }) {
  const router = useRouter();
  const currentRoute = router.asPath;

  // Obtenemos el documentId de la URL
  // Ejemplo: /websites/ABC123/dashboard => ["", "websites", "ABC123", "dashboard"]
  const routeParts = currentRoute.split('/');
  const documentId = routeParts[2] && routeParts[2] !== '[documentId]' ? routeParts[2] : '';
  const baseRoute = documentId ? `/websites/${documentId}` : '';

  // Menú de navegación para Websites

  
  const menuItems = [
    { name: 'Dashboard', icon: UserCircleIcon, path: `${baseRoute}/dashboard` },
    
  ];

  {/*
    
    { name: 'Configuraciones', icon: Cog6ToothIcon, path: `${baseRoute}/config` },
    { name: 'Proxy', icon: SignalIcon, path: `${baseRoute}/proxy` },
    { name: 'Integraciones', icon: CommandLineIcon, path: `${baseRoute}/integrations` },
    {
      name: 'Documentación',
      icon: DocumentTextIcon,
      path: 'https://docs.sitemaster.lat/websites',
      external: true
    },

  */}

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Menú lateral */}
      <div className="w-full md:w-1/5">
        <div className="flex flex-col gap-2">
          
          {/* Navegación superior */}
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              <span>Volver a mis websites</span>
            </Link>
          </div>

          {menuItems.map((item) => (
            item.external ? (
              <a
                key={item.name}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-2 py-2.5 text-left text-sm font-medium rounded-md flex items-center gap-x-2
                  transition-colors duration-200 ease-in-out text-gray-700 hover:bg-gray-200 hover:underline"
              >
                <item.icon className="h-5 w-5 text-gray-700" strokeWidth="2" />
                {item.name}
              </a>
            ) : (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`w-full px-2 py-2.5 text-left text-sm font-medium rounded-md flex items-center gap-x-2
                  transition-colors duration-200 ease-in-out
                  ${currentRoute === item.path
                    ? 'bg-gray-300 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-200 hover:underline'
                  }`}
              >
                <item.icon
                  className={`h-5 w-5 ${currentRoute === item.path ? 'text-emerald-700' : 'text-gray-700'}`}
                  strokeWidth="2"
                />
                {item.name}
              </button>
            )
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="w-full md:w-4/5">
        {children}
      </div>
    </div>
  );
}
