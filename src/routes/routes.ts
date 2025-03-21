export const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const navigation = [
  // { name: "Prueba gratis", href: "/trial", trial: true },
  { name: "Tus Websites", href: "/" },
  { name: "Tus VPS", href: "/vps" },
  //{ name: "Servicios", href: "/services" },
  { name: "Soporte", href: "/support" },
  // { name: "Soporte", href: "https://docs.wazend.net/", external: true },
];

export const userNavigation = [
  { name: "Tu perfil", href: "/profile" },
  { name: "Facturación", href: "/billing" , external: true},
//  { name: "Facturación", href: "https://status.wazend.net/", external: true },
  { name: "Cerrar sesión", href: "/", signOut: true },
];
