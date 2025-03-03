import useSWR from "swr";
import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { toast } from "sonner";
import Preload from "@/components/loaders/OrderSkeleton";

const API_KEY = process.env.NEXT_PUBLIC_WAZEND_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_WAZEND_API_URL;

// Fetcher para SWR con manejo de errores
const fetcher = async (url) => {
  try {
    // console.log(`🔍 Fetching data from: ${url}`);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apiKey: API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("❌ Error al obtener los datos");
    }

    const data = await response.json();
    // console.log("✅ Data recibida:", data);

    return data || null;
  } catch (error) {
    // console.error("❌ Fetch error:", error);
    return null;
  }
};

const ProxySettings = ({ name }) => {
  // console.log(`🆕 Componente montado con name: ${name}`);

  // Cargar datos con SWR
  const { data, error } = useSWR(`${API_URL}/proxy/find/${name}`, fetcher);

  // Estado inicial con valores predeterminados
  const [proxyData, setProxyData] = useState({
    enabled: false,
    host: "",
    port: "",
    protocol: "http", // Siempre inicia con "http"
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Actualizar estado cuando la API responde
  useEffect(() => {
    if (data !== undefined) {
      // console.log("🔄 Actualizando estado con datos de API...");
      setProxyData({
        enabled: data?.enabled ?? false,
        host: data?.host ?? "",
        port: data?.port ?? "",
        protocol: data?.protocol && data?.protocol !== "" ? data.protocol : "http", // Si es vacío, usar "http"
        username: data?.username ?? "",
        password: data?.password ?? "",
      });
    }
  }, [data]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(`✏️ Cambiando ${name}: ${value}`);
    setProxyData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en el switch
  const toggleEnabled = () => {
    // console.log("🔘 Toggle Enabled:", !proxyData.enabled);
    setProxyData((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  // Guardar configuración con POST en `/proxy/set/`
  const saveSettings = async () => {
    // Asegurar que siempre se envíe "http" si `protocol` está vacío
    const payload = {
      ...proxyData,
      protocol: proxyData.protocol && proxyData.protocol !== "" ? proxyData.protocol : "http",
    };

    // console.log("💾 Enviando datos a /proxy/set/:", payload);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/proxy/set/${name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      // console.log("📨 Respuesta del servidor:", result);

      if (response.ok) {
        toast.success("Configuración guardada correctamente");
      } else {
        toast.error("Error: invalid proxy");
      }
    } catch (error) {
      // console.error("❌ Error al conectar con el servidor:", error);
      toast.error("❌ Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    // console.error("❌ Error en SWR:", error);
    return <div>Error al cargar configuraciones.</div>;
  }

  if (!data && data !== null) return <Preload />;

  return (
    <div className="rounded-lg bg-white shadow-[0_0_5px_rgba(0,0,0,0.1)] p-6">
      {/* Toggle Switch */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Enabled</h2>
          <p className="text-sm text-gray-500">Enable or disable the proxy</p>
        </div>
        <Switch
          checked={proxyData.enabled}
          onChange={toggleEnabled}
          className={`${proxyData.enabled ? "bg-green-600" : "bg-gray-300"}
            relative inline-flex h-6 w-11 items-center rounded-full transition-all`}
        >
          <span
            className={`${
              proxyData.enabled ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-3 gap-4 border-t border-gray-300 pt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Protocol</label>
          <select
            name="protocol"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            value={proxyData.protocol}
            onChange={handleChange}
          >
            <option value="http">http</option>
            <option value="https">https</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
          <input
            type="text"
            name="host"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            value={proxyData.host}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
          <input
            type="number"
            name="port"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            value={proxyData.port}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-gray-300 pt-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            name="username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            value={proxyData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="text"
            name="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            value={proxyData.password}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={saveSettings}
        disabled={isLoading}
        className={`mt-4 px-4 py-2 rounded-md text-white transition-all duration-200 ${
          isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
        }`}
      >
        {isLoading ? "Guardando..." : "Guardar"}
      </button>
    </div>
  );
};

export default ProxySettings;
