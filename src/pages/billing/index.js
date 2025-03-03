import { useState } from 'react';
import Layout from '../../components/layout/dashboard';
import Billing from './billing';
import Subscription from './subscriptions';

export default function Index() {
    const [activeTab, setActiveTab] = useState('subscriptions'); // 'subscriptions' es el valor inicial

    return (
        <Layout>
            <div className="flex space-x-4">
                {/* Tabs */}
                <button
                    onClick={() => setActiveTab('subscriptions')}
                    className={`px-4 py-2 font-medium rounded-lg ${activeTab === 'subscriptions' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                >
                    Suscripciones
                </button>
                <button
                    onClick={() => setActiveTab('billing')}
                    className={`px-4 py-2 rounded-lg ${activeTab === 'billing' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                >
                    Historial de pagos
                </button>
            </div>

            {/* Content */}
            <div className="mt-8">
                {activeTab === 'subscriptions' ? <Subscription /> : <Billing />}
            </div>
        </Layout>
    );
}
