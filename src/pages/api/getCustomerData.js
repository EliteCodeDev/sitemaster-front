import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.WC_STORE_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: "wc/v3",
});

export default async function handler(req, res) {
  // 🔹 Protección: Solo aceptar solicitudes desde el mismo dominio
  const referer = req.headers.referer || "";
  if (!referer.includes(process.env.NEXTAUTH_URL)) {
    return res.status(403).json({ error: "Acceso no permitido" });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "El correo electrónico es requerido" });
  }

  try {
    // 🔹 1. Buscar el customer_id por email
    const { data: customers } = await api.get("customers", { email, role: "all" });

    if (customers.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    const customerId = customers[0].id;

    // 🔹 2. Obtener pedidos del cliente
    const { data: orders } = await api.get("orders", { customer: customerId });

    res.status(200).json({ customerId, orders });
  } catch (error) {
    console.error("Error en WooCommerce API:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al obtener datos del cliente" });
  }
}
