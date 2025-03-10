// src/pages/api/contabo/[documentId]/actions/[action].js
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const { documentId, action } = req.query;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Acciones permitidas
  const allowedActions = ['start', 'stop', 'restart', 'shutdown', 'resetPassword'];
  if (!allowedActions.includes(action)) {
    return res.status(400).json({ error: 'Acción no válida' });
  }

  const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const CLIENT_ID = process.env.NEXT_PUBLIC_CONTABO_CLIENT;
  const CLIENT_SECRET = process.env.NEXT_PUBLIC_CONTABO_SECRET;
  const API_USER = process.env.NEXT_PUBLIC_CONTABO_USER;
  const API_PASSWORD = process.env.NEXT_PUBLIC_CONTABO_PASS;

  try {
    // Paso 1: Obtener el instanceId desde Strapi usando el documentId
    const strapiResponse = await fetch(`${strapiUrl}/api/vps-services/${documentId}`);

    if (!strapiResponse.ok) {
      const strapiError = await strapiResponse.text();
      console.error('Error al obtener datos de Strapi:', strapiError);
      return res.status(strapiResponse.status).json({ error: 'No se pudo encontrar la instancia VPS en Strapi' });
    }

    const strapiData = await strapiResponse.json();
    const instanceId = strapiData.data.attributes.instanceId;

    if (!instanceId) {
      return res.status(404).json({ error: 'No se encontró un instanceId válido para este documento' });
    }

    // Obtener el token de acceso
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

    // Ejecutar la acción correspondiente
    const requestId = uuidv4();
    let apiUrl;
    let method = 'POST';
    let body = {};

    if (action === 'resetPassword') {
      apiUrl = `https://api.contabo.com/v1/compute/instances/${instanceId}/actions/resetPassword`;
    } else {
      apiUrl = `https://api.contabo.com/v1/compute/instances/${instanceId}/actions/${action}`;
    }

    const actionResponse = await fetch(apiUrl, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-request-id': requestId,
        'Content-Type': 'application/json',
      },
      body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
    });

    if (!actionResponse.ok) {
      const error = await actionResponse.text();
      console.error(`Error al ejecutar ${action}:`, error);
      return res.status(actionResponse.status).json({ error: `No se pudo ejecutar la acción ${action}` });
    }

    const actionData = await actionResponse.json();
    return res.status(200).json(actionData);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}