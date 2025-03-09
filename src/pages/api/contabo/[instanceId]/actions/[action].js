// src/pages/api/contabo/[instanceId]/actions/[action].js
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const { instanceId, action } = req.query;

  // Solo permitimos métodos POST para acciones
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Validar que la acción sea permitida
  const allowedActions = ['start', 'stop', 'restart', 'shutdown', 'resetPassword'];
  if (!allowedActions.includes(action)) {
    return res.status(400).json({ error: 'Acción no válida' });
  }

  // Contabo API credentials
  const CLIENT_ID = process.env.NEXT_PUBLIC_CONTABO_CLIENT;
  const CLIENT_SECRET = process.env.NEXT_PUBLIC_CONTABO_SECRET;
  const API_USER = process.env.NEXT_PUBLIC_CONTABO_USER;
  const API_PASSWORD = process.env.NEXT_PUBLIC_CONTABO_PASS;

  try {
    // Step 1: Get the access token
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
      console.error('Error obtaining access token:', error);
      return res.status(500).json({ error: 'Failed to authenticate with Contabo API' });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Step 2: Ejecutar la acción en la instancia
    const requestId = uuidv4();

    // La URL depende de la acción
    const url = `https://api.contabo.com/v1/compute/instances/${instanceId}/actions/${action}`;

    // Preparar el cuerpo para la solicitud
    let body = {};

    // Para resetPassword, necesitamos enviar el método (random, manual)
    if (action === 'resetPassword') {
      body = { method: 'random' };
    }

    const actionResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-request-id': requestId,
        'Content-Type': 'application/json',
      },
      // Siempre enviamos un cuerpo JSON, incluso si está vacío
      body: JSON.stringify(body),
    });

    if (!actionResponse.ok) {
      const errorText = await actionResponse.text();
      console.error(`Error executing ${action} on instance ${instanceId}:`, errorText);

      let errorResponse;
      try {
        errorResponse = JSON.parse(errorText);
      } catch (e) {
        errorResponse = { message: errorText };
      }

      return res.status(actionResponse.status).json({
        error: `Failed to execute ${action} on Contabo instance ${instanceId}`,
        details: errorResponse
      });
    }

    const actionData = await actionResponse.json();
    return res.status(200).json(actionData);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}