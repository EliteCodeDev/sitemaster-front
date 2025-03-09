import { userAgent } from "next/server";

// pages/api/screenshot.js
export const config = {
  api: {
    responseLimit: '10mb',
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  // Solo permitir solicitudes GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Obtener la URL desde los parámetros de consulta
  const { url } = req.query;

  // Validar URL
  if (!url) {
    return res.status(400).json({ error: 'Se requiere el parámetro URL' });
  }

  try {
    const TOKEN = process.env.NEXT_PUBLIC_SCRAPPER_TOKEN || "YOUR_API_TOKEN_HERE";
    const browserlessUrl = `${process.env.NEXT_PUBLIC_SCRAPPER_URL}screenshot?token=${TOKEN}`;

    const headers = {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json"
    };

    const data = {
      url: url,
      options: {
        fullPage: false,
        type: "jpeg",
        quality: 80
      },
      viewport:
      {
        deviceScaleFactor: 1,
        width: 1366,
        height: 768
      },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
    };

    const browserlessResponse = await fetch(browserlessUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    if (!browserlessResponse.ok) {
      throw new Error(`Browserless error: ${browserlessResponse.statusText}`);
    }

    const imageBuffer = await browserlessResponse.arrayBuffer();

    // Establecer encabezados apropiados para la respuesta de imagen
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache por 1 hora

    // Enviar la captura como respuesta
    res.status(200).send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('Error al tomar captura:', error);
    res.status(500).json({ error: 'Error al generar la captura de pantalla: ' + error.message });
  }
}