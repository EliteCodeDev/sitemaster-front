import React, { useEffect } from 'react'
import { useStrapiData } from '@/services/strapiServiceJWT'
import { useStrapiData as hola } from '@/services/strapiService'

import { useSession } from 'next-auth/react';

export default function Index() {
  // Se obtiene la sesión usando el hook useSession
  const { data: session } = useSession();

  // Se llama al hook useStrapiData utilizando el JWT de la sesión (si existe)
  const { data, error, isLoading } = useStrapiData(
    'users/me',
    session?.jwt  // Se usa el operador ? para evitar errores si session es null
  );
  const { data: subs, error: errorId, isLoading: isLoadingId } = useStrapiData(
    'users/me?populate=subscriptions',
    session?.jwt  // Se usa el operador ? para evitar errores si session es null
  );
  // Se utiliza useEffect para hacer algo cuando se tenga la data
  useEffect(() => {
    if (data) {
      console.log(data.id)
    }
    if (subs) {
      console.log(subs)
    }
  }, [data]);

  return (
    <div>index</div>
  )
}
