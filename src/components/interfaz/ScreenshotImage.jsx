// components/ScreenshotImage.js
import { useState, useEffect } from "react";

/**
 * Componente reutilizable para mostrar capturas de pantalla de URLs
 * usando background-image en un <div>.
 *
 * @param {string} url - URL del sitio para capturar (ej: "https://example.com")
 * @param {string} alt - Texto alternativo (usado como aria-label)
 * @param {string} className - Clases CSS adicionales
 * @param {Function} onClick - Manejador de evento click
 * @param {number} width - Ancho del contenedor (px)
 * @param {number} height - Alto del contenedor (px)
 * @param {string} fallbackImg - URL de imagen alternativa en caso de error
 * @param {boolean} autoLoad - Si debe cargar automáticamente al montar (por defecto true)
 * @param {Function} onLoad - Callback cuando la imagen se “carga” correctamente
 * @param {Function} onError - Callback cuando ocurre un error
 */
const ScreenshotImage = ({
  url,
  alt = "",
  className = "",
  onClick,
  width,
  height,
  fallbackImg = "",
  autoLoad = true,
  onLoad,
  onError,
  ...props
}) => {
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState("");

  // Tiempo extra de spinner después de que la imagen se descargue
  const EXTRA_DELAY_MS = 2000; // 2s, ajusta a tu gusto

  // Cantidad de tiempo (ms) que esperaremos en el servidor
  // para que las animaciones del sitio terminen (en el endpoint).
  const SERVER_WAIT_MS = 5000; // 5s en el servidor

  const loadScreenshot = async () => {
    if (!url) {
      setError("Se requiere una URL");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Generar timestamp único para evitar caché
      const timestamp = new Date().getTime();
      // Le pasamos "wait=SERVER_WAIT_MS" para que el servidor (Puppeteer) espere ese tiempo
      const apiUrl = `/api/screenshots?url=${encodeURIComponent(url)}&t=${timestamp}&wait=${SERVER_WAIT_MS}`;

      // Guardamos la URL que renderizará la captura
      setScreenshotUrl(apiUrl);

      // Creamos un objeto Image para verificar si la imagen (apiUrl) carga bien
      const testImg = new Image();
      testImg.src = apiUrl;

      // onload: cuando la imagen termine de descargarse
      testImg.onload = () => {
        // Retardo adicional para mantener el efecto un poco más
        setTimeout(() => {
          setLoading(false);
        }, EXTRA_DELAY_MS);

        if (onLoad) onLoad(apiUrl);
      };

      // onerror: si la imagen falla
      testImg.onerror = () => {
        const errorMsg = "Error al generar la captura";
        setError(errorMsg);
        if (onError) onError(errorMsg);
        setLoading(false);
      };
    } catch (err) {
      const errorMsg = "Error al generar la captura";
      setError(errorMsg);
      if (onError) onError(errorMsg);
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carga la captura al montar, o cuando cambia 'url'
    if (autoLoad && url) {
      loadScreenshot();
    } else {
      setLoading(false);
    }
  }, [url]);

  // 1) MIENTRAS CARGA: mostrar un div gris con animación de pulso
  if (loading) {
    return (
      <div
        className={`rounded bg-gray-400 animate-pulse ${className}`}
        style={{ width, height }}
        onClick={onClick}
        {...props}
      />
    );
  }

  // 2) SI HAY ERROR:
  if (error) {
    // Si existe fallbackImg, la usamos como fondo
    if (fallbackImg) {
      return (
        <div
          className={`rounded bg-cover bg-center ${className}`}
          style={{
            width,
            height,
            backgroundImage: `url("${fallbackImg}")`,
          }}
          aria-label={alt || `Imagen alternativa para ${url}`}
          role="img"
          onClick={onClick}
          {...props}
        />
      );
    }
    // De lo contrario, mostramos mensaje de error
    return (
      <div
        className={`screenshot-error ${className} grid place-items-center text-center text-sm p-2`}
        style={{ width, height }}
      >
        {error}
        <p>Url: {url}</p>
      </div>
    );
  }

  // 3) SIN ERROR Y NO ESTÁ CARGANDO: usamos la URL de la captura como background
  return (
    <div
      className={`rounded bg-cover bg-center ${className}`}
      style={{
        width,
        height,
        backgroundImage: `url("${screenshotUrl}")`,
      }}
      aria-label={alt || `Captura de ${url}`}
      role="img"
      onClick={onClick}
      {...props}
    />
  );
};

export default ScreenshotImage;
