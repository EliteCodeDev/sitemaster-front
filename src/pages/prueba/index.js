// pages/ejemplo.js
import { useState } from 'react';
import ScreenshotImage from "@/components/interfaz/ScreenshotImage";

export default function EjemploUso() {
  const [url, setUrl] = useState('https://example.com');
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    alert(`Has hecho clic en la captura de pantalla ${count + 1} veces`);
  };

  const handleLoadSuccess = (imageUrl) => {
    console.log('Captura cargada correctamente:', imageUrl);
  };

  const handleError = (errorMsg) => {
    console.error('Error en la captura:', errorMsg);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ejemplos de uso del componente ScreenshotImage</h1>

      <div className="mb-6">
        <label className="block mb-2">URL para capturar:</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ejemplo básico */}
        <div className="border p-4 rounded">
          <h2 className="font-bold mb-2">Básico</h2>
          <ScreenshotImage
            url={url}
            className="w-full h-auto border rounded"
          />
        </div>

        {/* Con evento onClick */}
        <div className="border p-4 rounded">
          <h2 className="font-bold mb-2">Con onClick</h2>
          <ScreenshotImage
            url={url}
            className="w-full h-auto border rounded cursor-pointer"
            onClick={handleClick}
            alt="Captura con evento de clic"
          />
          <p className="mt-2 text-sm">Clics: {count}</p>
        </div>

        {/* Con tamaño específico */}
        <div className="border p-4 rounded">
          <h2 className="font-bold mb-2">Tamaño específico</h2>
          <ScreenshotImage
            url={url}
            className="border rounded"
            width={300}
            height={200}
            alt="Captura con tamaño específico"
          />
        </div>

        {/* Con imagen de respaldo */}
        <div className="border p-4 rounded">
          <h2 className="font-bold mb-2">Con imagen de respaldo</h2>
          <ScreenshotImage
            url="https://sitio-que-no-existe.ejemplo"
            className="w-full h-auto border rounded"
            fallbackImg="/placeholder-image.jpg"
            alt="Captura con imagen de respaldo"
          />
          <p className="mt-2 text-sm text-gray-500">Intenta cargar un sitio que no existe</p>
        </div>

        {/* Con callbacks */}
        <div className="border p-4 rounded">
          <h2 className="font-bold mb-2">Con callbacks</h2>
          <ScreenshotImage
            url={url}
            className="w-full h-auto border rounded"
            onLoad={handleLoadSuccess}
            onError={handleError}
            alt="Captura con callbacks"
          />
          <p className="mt-2 text-sm text-gray-500">Revisa la consola para ver los mensajes</p>
        </div>

        {/* Con carga manual */}
        <div className="border p-4 rounded">
          <h2 className="font-bold mb-2">Carga manual</h2>
          <ScreenshotImage
            url={url}
            className="w-full h-auto border rounded mb-2"
            autoLoad={false}
            alt="Captura con carga manual"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => document.querySelector('#manualLoad').click()}
          >
            Cargar captura
          </button>
        </div>
      </div>
    </div>
  );
}