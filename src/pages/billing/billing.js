import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useSession } from "next-auth/react"; // Importa useSession
import Loader from '../../components/loaders/OrderSkeleton';

export default function BuscarCliente() {
  const { data: session, status } = useSession(); // Obtiene la sesión del usuario
  const [customerId, setCustomerId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    if (status === "loading") return; // Espera que la sesión se cargue
    if (!session) {
      setError("No estás autenticado.");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const email = session.user.email; // Obtén el email de la sesión
        const response = await fetch(`/api/getCustomerData?email=${encodeURIComponent(email)}`);
        const data = await response.json();

        // console.log("🔹 Datos recibidos de la API:", data);

        if (response.ok) {
          setCustomerId(data.customerId);
          setOrders(data.orders);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Error al realizar la solicitud.");
      }
      setLoading(false); // Se terminó de cargar
    };

    fetchOrders();
  }, [session, status]); // Asegúrate de que se ejecute después de obtener la sesión

  // Función para formatear la fecha con `date-fns`
  const formatFecha = (fecha) => {
    return format(new Date(fecha), "dd/MM/yyyy HH:mm", { locale: es });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Historial de pagos</h1>

      {loading ? (
        <Loader/>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
        <div className="mt-6 p-4 overflow-x-auto dark:bg-black bg-white shadow-md rounded-lg dark:text-white dark:border-zinc-700 dark:shadow-black">
          {orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow >
                  <TableHead>ID</TableHead>
                  <TableHead>Producto(s)</TableHead>
                  <TableHead>Fecha de factura</TableHead>
                  <TableHead>Fecha de pago</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      {order.line_items.map((item) => item.name).join(", ")}
                    </TableCell>
                    <TableCell>{formatFecha(order.date_created)}</TableCell>
                    <TableCell>{order.date_paid ? formatFecha(order.date_paid) : '-'}</TableCell>
                    <TableCell>{order.currency} {order.total}</TableCell>
                    <TableCell className="capitalize">{order.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-600 mt-4">No se encontraron pedidos.</p>
          )}
          </div>
        </>
      )}
    </div>
  );
}
