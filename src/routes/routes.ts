export const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const navigation = [
  // { name: "Prueba gratis", href: "/trial", trial: true },
  { name: "Tus Websites", href: "/" },
  { name: "Servicios", href: "/services" },
  { name: "Soporte", href: "/suport" },
  // { name: "Soporte", href: "https://docs.wazend.net/", external: true },
];

export const userNavigation = [
  { name: "Tu perfil", href: "/profile" },
  { name: "Facturación", href: "/billing" },
  { name: "Reportes", href: "https://status.wazend.net/", external: true },
  { name: "Cerrar sesión", href: "/", signOut: true },
];
