// src/pages/websites/[documentId]/layoutGeneral.js
import { CommandLineIcon } from '@heroicons/react/24/outline';
import { 
  UserCircleIcon, 
  Cog6ToothIcon, 
  DocumentTextIcon, 
  SignalIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LayoutWebsite({ children }) {
  const router = useRouter();
  const currentRoute = router.asPath;

  // Obtenemos el documentId de la URL
  const routeParts = currentRoute.split('/');
  const documentId = routeParts[2] && routeParts[2] !== '[documentId]' ? routeParts[2] : '';
  const baseRoute = documentId ? `/websites/${documentId}` : '';

  // Menú de navegación para Websites
  const menuItems = [
    { name: 'Dashboard', icon: UserCircleIcon, path: `${baseRoute}/dashboard` },
    // Puedes agregar más elementos de menú según sea necesario
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Menú lateral */}
      <div className="w-full md:w-1/5">
        <div className="bg-white rounded-lg shadow-sm p-4">
          {/* Navegación superior */}
          <div className="mb-6">
            <Link href="/websites" className="inline-flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              <span>Volver a mis websites</span>
            </Link>
          </div>

          <div className="space-y-2">
            {menuItems.map((item) => (
              item.external ? (
                <a
                  key={item.name}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-3 text-left text-sm font-medium rounded-md flex items-center gap-x-3
                    transition-colors duration-200 ease-in-out text-gray-700 hover:bg-gray-100"
                >
                  <item.icon className="h-5 w-5 text-gray-500" strokeWidth="2" />
                  {item.name}
                </a>
              ) : (
                <button
                  key={item.name}
                  onClick={() => router.push(item.path)}
                  className={`w-full px-4 py-3 text-left text-sm font-medium rounded-md flex items-center gap-x-3
                    transition-colors duration-200 ease-in-out
                    ${currentRoute === item.path
                      ? 'bg-gray-100 text-emerald-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${currentRoute === item.path ? 'text-emerald-600' : 'text-gray-500'}`}
                    strokeWidth="2"
                  />
                  {item.name}
                </button>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="w-full md:w-4/5">
        {children}
      </div>
    </div>
  );
}