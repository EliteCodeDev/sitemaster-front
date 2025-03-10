// src/pages/api/contabo/[documentId]/index.js
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const { documentId } = req.query;

  // Solo permitimos métodos GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Strapi URL
  const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Contabo API credentials
  const CLIENT_ID = process.env.NEXT_PUBLIC_CONTABO_CLIENT;
  const CLIENT_SECRET = process.env.NEXT_PUBLIC_CONTABO_SECRET;
  const API_USER = process.env.NEXT_PUBLIC_CONTABO_USER;
  const API_PASSWORD = process.env.NEXT_PUBLIC_CONTABO_PASS;

  try {
    // Paso 1: Obtener el instanceId desde Strapi usando el documentId
    const strapiResponse = await fetch(`${strapiUrl}/api/vps-services/${documentId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!strapiResponse.ok) {
      const strapiError = await strapiResponse.text();
      console.error('Error al obtener datos de Strapi:', strapiError);
      return res.status(strapiResponse.status).json({ error: 'No se pudo encontrar la instancia VPS en Strapi' });
    }

    const strapiData = await strapiResponse.json();
    console.log('Strapi data:', strapiData);
    const instanceId = strapiData.data.instanceId;

    if (!instanceId) {
      return res.status(404).json({ error: 'No se encontró un instanceId válido para este documento' });
    }

    // Paso 2: Obtener el token de acceso para Contabo
    const tokenResponse = await fetch('https://auth.contabo.com/auth/realms/contabo/protocol/openid-connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'username': API_USER,
        'password': API_PASSWORD,
        'grant_type': 'password',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Error al obtener el token de acceso:', error);
      return res.status(500).json({ error: 'Error al autenticarse con la API de Contabo' });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Paso 3: Obtener detalles de la instancia de Contabo
    const requestId = uuidv4();

    const instanceResponse = await fetch(`https://api.contabo.com/v1/compute/instances/${instanceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-request-id': requestId,
        'Content-Type': 'application/json',
      },
    });

    if (!instanceResponse.ok) {
      const error = await instanceResponse.text();
      console.error(`Error al obtener la instancia ${instanceId}:`, error);
      return res.status(instanceResponse.status).json({ error: `No se pudo obtener la instancia de Contabo ${instanceId}` });
    }

    const instanceData = await instanceResponse.json();
    return res.status(200).json(instanceData);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}