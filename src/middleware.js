export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/profile",
    "/trial",
    "/services",
    "/dashboard",
    "/upgrade",
    "/create",
    "/websites/:path*",
    "/vps/:path*",
    "/",
  ]
};