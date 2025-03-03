import useSWR from 'swr';
import { Switch } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Preload from '@/components/loaders/OrderSkeleton';

const API_KEY = process.env.NEXT_PUBLIC_WAZEND_API_KEY;

const settingDescriptions = {
    rejectCall: { title: 'Rechazar llamadas', description: 'Rechaza automáticamente las llamadas entrantes.' },
    groupsIgnore: { title: 'Ignorar grupos', description: 'Ignora mensajes y notificaciones de chats grupales.' },
    alwaysOnline: { title: 'Siempre en línea', description: 'Mantiene el estado de la cuenta como "en línea" todo el tiempo.' },
    readMessages: { title: 'Leer mensajes automáticamente', description: 'Marca los mensajes como leídos automáticamente al recibirlos.' },
    readStatus: { title: 'Leer estados automáticamente', description: 'Ve automáticamente los estados de los contactos sin necesidad de abrirlos.' },
    syncFullHistory: { title: 'Sincronizar historial completo', description: 'Sincroniza todo el historial de mensajes en la cuenta.' },
    msgCall: { title: 'Mensaje de rechazo', description: 'Mensaje personalizado al rechazar llamadas.' }
};

const fetcher = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': API_KEY,
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

const InstancePage = ({ name }) => {
    const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_WAZEND_API_URL}/settings/find/${name}`, fetcher);

    const [settings, setSettings] = useState({
        rejectCall: false,
        groupsIgnore: false,
        alwaysOnline: false,
        readMessages: false,
        readStatus: false,
        syncFullHistory: false,
        msgCall: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (data) {
            setSettings({
                rejectCall: data.rejectCall,
                groupsIgnore: data.groupsIgnore,
                alwaysOnline: data.alwaysOnline,
                readMessages: data.readMessages,
                msgCall: data.msgCall || '',
            });
        }
    }, [data]);

    const updateSettings = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_WAZEND_API_URL}/settings/set/${name}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apiKey': API_KEY,
                },
                body: JSON.stringify({ ...settings, readStatus: false, syncFullHistory: false }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Configuración guardada correctamente');
            } else {
                toast.error('Error al guardar la configuración.');
            }
        } catch (error) {
            toast.error('Error al guardar la configuración.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSetting = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleInputChange = (e) => {
        setSettings((prev) => ({ ...prev, msgCall: e.target.value }));
    };

    if (error) return <div>Error al cargar configuraciones.</div>;
    if (!data) return  <Preload />;

    return (
        <>
            <div className="rounded-lg bg-white shadow-[0_0_5px_rgba(0,0,0,0.1)] p-6">
                <div className="space-y-4">

                <p className='mb-4 text-lg font-semibold'>Ajustes de WhatsApp</p>
                    {/* Rechazar llamadas con el campo de mensaje justo debajo */}
                    <div className="py-3 border-b">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-900">{settingDescriptions.rejectCall.title}</p>
                                <p className="text-gray-600 text-sm">{settingDescriptions.rejectCall.description}</p>
                            </div>
                            <Switch
                                checked={settings.rejectCall}
                                onChange={() => toggleSetting('rejectCall')}
                                className={`${settings.rejectCall ? 'bg-purple-600' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full`}
                            >
                                <span className="sr-only">Toggle {settingDescriptions.rejectCall.title}</span>
                                <span
                                    className={`${settings.rejectCall ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition`}
                                />
                            </Switch>
                        </div>

                        {/* Cuadro de texto debajo cuando está activo */}
                        {settings.rejectCall && (
                            <div className="mt-2">
                                <input
                                    type="text"
                                    value={settings.msgCall}
                                    onChange={handleInputChange}
                                    placeholder="Escribe tu mensaje aquí..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        )}
                    </div>

                    {/* Otras configuraciones */}
                    {Object.entries(settings).map(([key, value]) => (
                        key !== 'rejectCall' && key !== 'msgCall' && (
                            <div key={key} className="flex justify-between items-center py-3 border-b">
                                <div>
                                    <p className="font-semibold text-gray-900">{settingDescriptions[key]?.title}</p>
                                    <p className="text-gray-600 text-sm">{settingDescriptions[key]?.description}</p>
                                </div>
                                <Switch
                                    checked={value}
                                    onChange={() => toggleSetting(key)}
                                    className={`${value ? 'bg-purple-600' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full`}
                                >
                                    <span className="sr-only">Toggle {settingDescriptions[key]?.title}</span>
                                    <span
                                        className={`${value ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition`}
                                    />
                                </Switch>
                            </div>
                        )
                    ))}
                </div>

                <button
                    onClick={updateSettings}
                    disabled={isLoading}
                    className={`mt-4 px-4 py-2 rounded-md text-white ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600'}`}
                >
                    {isLoading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>

        </>
    );
};

export default InstancePage;
