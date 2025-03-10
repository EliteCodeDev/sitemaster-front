// src/pages/api/contabo/index.js
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  // Verificar si el método es GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Extraer JWT desde los headers de la petición
    const authHeader = req.headers.authorization || '';
    const strapiJWT = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    console.log('JWT de Strapi disponible:', !!strapiJWT);

    if (!strapiJWT) {
      return res.status(401).json({ error: 'No se proporcionó token JWT' });
    }

    // Contabo API credentials
    const CLIENT_ID = process.env.NEXT_PUBLIC_CONTABO_CLIENT;
    const CLIENT_SECRET = process.env.NEXT_PUBLIC_CONTABO_SECRET;
    const API_USER = process.env.NEXT_PUBLIC_CONTABO_USER;
    const API_PASSWORD = process.env.NEXT_PUBLIC_CONTABO_PASS;

    // Consultar a Strapi por las instancias del usuario (ahora a través de subscriptions)
    const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    let instanceIds = [];
    let userData = null;

    if (strapiUrl && strapiJWT) {
      // Nueva ruta que obtiene subscriptions con sus vps_service anidados
      const strapiEndpoint = `${strapiUrl}/api/users/me?populate[subscriptions][populate]=vps_service`;
      console.log('Consultando Strapi en:', strapiEndpoint);

      const strapiResponse = await fetch(strapiEndpoint, {
        headers: {
          'Authorization': `Bearer ${strapiJWT}`
        }
      });

      if (strapiResponse.ok) {
        userData = await strapiResponse.json();
        console.log('Datos de usuario de Strapi:', JSON.stringify(userData, null, 2));

        // Extraer IDs de instancias de todas las subscripciones
        if (userData && userData.subscriptions && Array.isArray(userData.subscriptions)) {
          // Recorremos todas las subscripciones
          userData.subscriptions.forEach(subscription => {
            // Por cada subscripción, si tiene vps_service, extraemos los IDs
            if (subscription.vps_service) {
              const instanceId = subscription.vps_service.instanceId;
              if (instanceId) {
                instanceIds.push(instanceId);
              }
            }
          });
        } else {
          console.log('No se encontraron subscripciones o formato inesperado:', userData);
        }
      } else {
        const errorText = await strapiResponse.text();
        console.error('Error al obtener datos de Strapi:', errorText);
        return res.status(strapiResponse.status).json({
          error: 'Error al consultar Strapi',
          details: errorText
        });
      }
    } else {
      return res.status(400).json({ error: 'No se pudo consultar a Strapi: URL o JWT no disponibles' });
    }

    const instanceIdsString = instanceIds.length > 0 ? instanceIds.join(',') : '';
    console.log('IDs de instancias:', instanceIdsString);

    // Obtener token de Contabo
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
      return res.status(500).json({ error: 'Failed to authenticate with Contabo API', details: error });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Consultar instancias de Contabo
    const requestId = uuidv4();

    // Construir URL con filtro de IDs si está disponible
    const url = instanceIdsString
      ? `https://api.contabo.com/v1/compute/instances?instanceIds=${instanceIdsString}`
      : `https://api.contabo.com/v1/compute/instances`;

    console.log('Consultando Contabo API:', url);

    const instancesResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-request-id': requestId,
        'Content-Type': 'application/json',
      },
    });

    if (!instancesResponse.ok) {
      const error = await instancesResponse.text();
      console.error('Error fetching instances:', error);
      return res.status(instancesResponse.status).json({
        error: 'Failed to fetch Contabo instances',
        details: error
      });
    }

    const instancesData = await instancesResponse.json();
    console.log('Contabo instances:', JSON.stringify(instancesData, null, 2));
    // Incluimos los datos de usuario en la respuesta para tener acceso a las suscripciones
    return res.status(200).json({
      ...instancesData,
      userData: userData
    });

  } catch (error) {
    console.error('Error completo:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}