import React from 'react';

export default function EjemploUso() {
  // Datos que queremos enviar a la página de pago
  const prefillData = {
    buyerName: 'Fernando Olivert Pantoja Payajo', // Nombre completo del comprador
    buyerEmail: 't1053300121@unitru.edu.pe', // Correo electrónico del comprador
    confirmEmail: 't1053300121@unitru.edu.pe' // Confirmación del correo electrónico
    // Agrega aquí otros parámetros según lo que soporte la integración
  };

  // Convertimos los datos a query params
  const queryString = new URLSearchParams(prefillData).toString();
  
  // URL base de Hotmart (sin parámetros predefinidos)
  const baseUrl = 'https://pay.hotmart.com/N98570639F';
  const paymentUrl = `${baseUrl}?${queryString}`;

  return (
    <iframe
      title="Hotmart Payment Page prefilled"
      src={paymentUrl}
      style={{ width: '100%', height: '100vh', border: 'none' }}
    />
  );
}