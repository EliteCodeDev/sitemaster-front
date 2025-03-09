// src/pages/api/contabo/[instanceId]/index.js
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const { instanceId } = req.query;

  // Solo permitimos métodos GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
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

    // Step 2: Get instance details
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
      console.error(`Error fetching instance ${instanceId}:`, error);
      return res.status(instanceResponse.status).json({ error: `Failed to fetch Contabo instance ${instanceId}` });
    }

    const instanceData = await instanceResponse.json();
    return res.status(200).json(instanceData);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}