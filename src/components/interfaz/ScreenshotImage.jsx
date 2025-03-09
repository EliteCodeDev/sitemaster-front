// components/ScreenshotImage.js
import { useState, useEffect } from "react";
import Spin from "../loaders/spin";

/**
 * Componente reutilizable para mostrar capturas de pantalla de URLs
 *
 * @param {string} url - URL del sitio para capturar
 * @param {string} alt - Texto alternativo para la imagen
 * @param {string} className - Clases CSS para la imagen
 * @param {Function} onClick - Manejador de evento click
 * @param {number} width - Ancho de la imagen (opcional)
 * @param {number} height - Alto de la imagen (opcional)
 * @param {string} fallbackImg - URL de imagen alternativa en caso de error
 * @param {boolean} autoLoad - Si debe cargar automáticamente al montar (por defecto true)
 * @param {Function} onLoad - Callback cuando la imagen se carga correctamente
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
      const apiUrl = `/api/screenshots?url=${encodeURIComponent(
        url
      )}&t=${timestamp}`;
      setScreenshotUrl(apiUrl);

      // Esperar un poco antes de quitar el loader para evitar parpadeos
      setTimeout(() => {
        setLoading(false);
      }, 300);

      if (onLoad) onLoad(apiUrl);
    } catch (err) {
      const errorMsg = "Error al generar la captura";
      setError(errorMsg);
      if (onError) onError(errorMsg);
      console.error(err);
      setLoading(false);
    }
  };

  const handleImageError = () => {
    const errorMsg = "Error al cargar la imagen. Intente de nuevo más tarde.";
    setError(errorMsg);
    if (onError) onError(errorMsg);
  };

  useEffect(() => {
    if (autoLoad && url) {
      loadScreenshot();
    } else if (!autoLoad) {
      setLoading(false);
    }
  }, [url]); // Se vuelve a cargar cuando cambia la URL

  // Mientras carga, muestra el spinner
  if (loading) {
    return (
      <div
        className={`screenshot-loader ${className} w-full h-full grid place-items-center`}
        style={{ width, height }}
      >
        <Spin />
      </div>
    );
  }

  // Si hay error y existe una imagen de respaldo, la muestra
  if (error && fallbackImg) {
    return (
      <img
        src={fallbackImg}
        alt={alt || `Imagen alternativa para ${url}`}
        className={className}
        onClick={onClick}
        width={width}
        height={height}
        {...props}
      />
    );
  }

  // Si hay error y no hay imagen de respaldo, muestra mensaje de error
  if (error) {
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

  // Renderiza la imagen con todas las propiedades pasadas
  return (
    <img
      src={screenshotUrl}
      alt={alt || `Captura de ${url}`}
      className={className}
      onClick={onClick}
      width={width}
      height={height}
      onError={handleImageError}
      {...props}
    />
  );
};

export default ScreenshotImage;
