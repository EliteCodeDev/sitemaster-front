import { CommandLineIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon, Cog6ToothIcon, DocumentTextIcon, SignalIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

export default function Profile({ children }) {
  const router = useRouter();
  const currentRoute = router.asPath;
  const routeParts = currentRoute.split('/');
  const instanceId = routeParts[2] && routeParts[2] !== '[id]' ? routeParts[2] : ''; // Mantiene el ID dinámico correctamente
  const baseRoute = instanceId ? `/instances/${instanceId}` : '';

  // Lista de botones con información de cada uno
  const menuItems = [
    { name: 'Dashboard', icon: UserCircleIcon, path: `${baseRoute}/dashboard` },
    { name: 'Configuraciones', icon: Cog6ToothIcon, path: `${baseRoute}/config` },
    { name: 'Proxy', icon: SignalIcon, path: `${baseRoute}/proxy` },
    { name: 'Integraciones', icon: CommandLineIcon, path: `${baseRoute}/integrations` },
    { name: 'Documentación', icon: DocumentTextIcon, path: `https://docs.wazend.net/wazend` },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Primera columna: Menú de navegación */}
        <div className="w-full md:w-1/5">
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`w-full px-2 py-2.5 text-left text-sm font-medium rounded-md flex items-center gap-x-2 transition-colors duration-200 ease-in-out border-l-0 ${currentRoute === item.path
                    ? 'bg-gray-300 text-purple-700 border-purple-700'
                    : 'text-gray-700 hover:bg-gray-200 hover:underline border-transparent'
                  }`}
              >
                <item.icon className={`h-5 w-5 ${currentRoute === item.path ? 'text-purple-700' : 'text-gray-700'}`} strokeWidth="2" />
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido de la sección */}
        <div className="w-full md:w-4/5">

          {/* <a
            href="https://docs.wazend.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Documentación
          </a> */}

          {children}
        </div>
      </div>
    </>
  );
}
