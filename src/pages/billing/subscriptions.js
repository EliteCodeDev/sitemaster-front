import { useSession } from 'next-auth/react'; // Importamos el hook de sesión
import Loader from '../../components/loaders/OrderSkeleton';
import { useStrapiData } from '../../services/strapiServiceJWT';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { format } from "date-fns";

const SubsPage = () => {
    const { data: session } = useSession(); // Obtenemos la sesión
    const token = session?.jwt; // Extraemos el token JWT de la sesión

    // Usamos el hook que creamos para obtener los datos de 'orders'
    const { data, error, isLoading } = useStrapiData('users/me?populate=subscriptions', token);

    // Imprimir la data en consola
    console.log('Data:', data); // Aquí imprimimos la data que obtenemos

    if (isLoading) {
        return (
            <Loader />
        );
    }

    if (error) {
        return (
            <>
                <div className="text-red-600 dark:text-red-400">
                    Error al cargar los datos: {error.message}
                </div>
            </>
        );
    }

    // Accedemos a subscritions_woos
    const subscriptions = data?.subscriptions || [];

    const formatFecha = (fecha) => {
        return format(new Date(fecha), "dd/MM/yyyy");
    };


    return (
        <>

            <div>
                <p className="text-2xl font-semibold mb-4">Panel de facturación</p>
                <p className="text-base mb-6">
                    Accede a nuestro panel de suscripciones, donde podrás gestionar tus suscripciones, métodos de pago y más. Mantén todo organizado y bajo control de manera sencilla y eficiente.
                </p>
                <a
                    href="https://wazend.net/my-account/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-2 bg-[var(--app-primary)] text-white font-semibold rounded-lg shadow-md hover:bg-[var(--app-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] transition duration-200"
                >
                    <span>Ir a gestionar suscripciones</span>
                    <ChevronRightIcon className="w-5 h-5 ml-2 text-white" />
                </a>

            </div>


            <div className="mt-6 p-4 overflow-x-auto dark:bg-black bg-white shadow-md rounded-lg dark:text-white dark:border-zinc-700 dark:shadow-black">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Producto(s)</TableHead>
                            <TableHead>Expira</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscriptions.length > 0 ? (
                            subscriptions.map((subscription, index) => (
                                <TableRow key={index}>
                                    {/* Usamos las variables desde el objeto subscription */}
                                    <TableCell className="font-medium">{subscription.id_woo}</TableCell>
                                    <TableCell>Plan API</TableCell>
                                    <TableCell>{subscription.next_payment_date_gmt ? formatFecha(subscription.next_payment_date_gmt) : '-'}</TableCell>
                                    <TableCell>USD {subscription.total}/{subscription.billing_period}</TableCell>
                                    <TableCell>{subscription.status_woo}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    No hay datos para mostrar.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};

export default SubsPage;
