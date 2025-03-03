import Layout from '../../components/layout/dashboard';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Store from './store';

export default function Index() {

    return (
        <Layout title="Servicios">
            <Store/>
        </Layout>
    );
}
