import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import LogoGravatar from '../components/LogoGravatar'
import ToggleMode from '../components/ui/toggle-mode'


const navigation = [
  { name: 'Prueba gratis', href: '/trial', trial: true },
  { name: 'Tus instancias', href: '/' },
  { name: 'Servicios', href: '/services' },
  { name: 'Documentación', href: 'https://docs.wazend.net/', external: true },
]

const userNavigation = [
  { name: 'Tu perfil', href: '/profile' },
  { name: 'Facturación', href: '/billing' },
  { name: 'Reportes', href: 'https://status.wazend.net/', external: true },
  { name: 'Cerrar sesión', href: '/', signOut: true }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const router = useRouter()
  const [currentPath, setCurrentPath] = useState(router.pathname)
  const { data: session } = useSession()

  useEffect(() => {
    const handleRouteChange = (url) => {
      setCurrentPath(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  const handleSignOut = () => {
    signOut({ redirect: false }).then(() => {
      router.push('/login') // Redirige a la página de login o inicio
    })
  }

  return (
    <>
      <Disclosure as="nav" className="bg-white shadow-sm border-b border-gray-100 dark:bg-gray-900 dark:border-gray-700">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                {/* Logo */}
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <Link href="/">
                      <Image
                        className="block h-8 w-auto lg:hidden dark:hidden"
                        src="/images/icon-dark.svg"
                        alt="Wazend Logo"
                        width={236}
                        height={60}
                      />
                      <Image
                        className="hidden h-8 w-auto lg:block dark:hidden"
                        src="/images/icon-dark.svg"
                        alt="Wazend Logo"
                        width={236}
                        height={60}
                      />
                      {/* Logo para modo oscuro */}
                      <Image
                        className="hidden dark:block h-8 w-auto"
                        src="/images/icon-light.svg"
                        alt="Wazend Logo"
                        width={236}
                        height={60}
                      />
                    </Link>
                  </div>

                  {/* Navegación */}
                  <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          currentPath === item.href
                            ? "border-[var(--app-primary)] text-gray-900 dark:text-white"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200",
                          "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                        )}
                        aria-current={currentPath === item.href ? "page" : undefined}
                        target={item.external ? "_blank" : undefined}
                      >
                        <span className={item.trial ? "bg-[var(--app-primary)] text-white px-2 py-1 rounded-lg" : ""}>
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Perfil y Toggle Mode */}
                <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-2">
                  {session && (
                    <>
                      <div className="relative">
                        <p className="text-gray-500 text-sm font-medium lg:block hidden dark:text-gray-300">
                          {session.user.name}
                        </p>
                      </div>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative flex rounded-full bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] focus:ring-offset-2">
                            <span className="sr-only">Open user menu</span>
                            <LogoGravatar email={session.user.email} size={40} />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-600">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <Link
                                    href={item.href}
                                    className={classNames(
                                      item.signOut ? "text-red-500" : "",
                                      active ? "bg-gray-100 dark:bg-gray-700" : "",
                                      "block px-4 py-2 text-sm text-gray-700 dark:text-gray-300"
                                    )}
                                    onClick={item.signOut ? handleSignOut : undefined}
                                    target={item.external ? "_blank" : undefined}
                                  >
                                    <div className="flex items-center">
                                      {item.name}
                                      {item.external && <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 ml-2 text-gray-700 dark:text-gray-300" />}
                                    </div>
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </>
                  )}

                  {/* Botón para alternar Modo Oscuro */}
                  {/* <ToggleMode /> */}
                </div>

                {/* Botón menú móvil */}
                <div className="-mr-2 flex items-center sm:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                    <span className="sr-only">Open main menu</span>
                    {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Menú desplegable móvil */}
            {session && (
              <Disclosure.Panel className="sm:hidden dark:bg-gray-900">
                <div className="space-y-1 pb-3 pt-2">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      href={item.href}
                      className={classNames(
                        currentPath === item.href
                          ? "border-[var(--app-primary)] bg-[var(--app-primary)] text-[var(--app-primary)] dark:bg-gray-800 dark:text-white"
                          : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200",
                        "block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
                      )}
                      aria-current={currentPath === item.href ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>

                <div className="border-t border-gray-200 pb-3 pt-4 dark:border-gray-700">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <LogoGravatar email={session.user.email} size={40} className="h-10 w-10 rounded-full" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800 dark:text-white">{session.user.name}</div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{session.user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as={item.external ? "a" : Link}
                        href={item.href}
                        className={`block px-4 py-2 text-base font-medium ${item.signOut ? "text-red-500 hover:text-red-600" : "text-gray-500 dark:text-gray-300"
                          } hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white`}
                        onClick={(e) => {
                          if (item.signOut) {
                            e.preventDefault();
                            handleSignOut();
                          }
                        }}
                        target={item.external ? "_blank" : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>


              </Disclosure.Panel>
            )}
          </>
        )}
      </Disclosure>
    </>

  )
}
