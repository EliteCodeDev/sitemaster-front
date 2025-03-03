
import { toast } from 'sonner';

const ButtonControl = ({ instanceName }) => {

  const handleRestart = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WAZEND_API_URL}/instance/restart/${instanceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apiKey': process.env.NEXT_PUBLIC_WAZEND_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Reinicio exitoso:', data);
      toast.success('Reiniciado correctamente.');
      // Aquí puedes manejar la respuesta o mostrar una notificación de éxito
    } catch (error) {
      console.error('Error al reiniciar:', error);
      // Aquí puedes manejar el error o mostrar una notificación de fallo
    }
  };

  const handleDisconnect = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WAZEND_API_URL}/instance/logout/${instanceName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'apiKey': process.env.NEXT_PUBLIC_WAZEND_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Desconexión exitosa:', data);
      // Aquí puedes manejar la respuesta o mostrar una notificación de éxito
      window.location.reload(); // Recarga la página después de un reinicio exitoso
    } catch (error) {
      console.error('Error al desconectar:', error);
      // Aquí puedes manejar el error o mostrar una notificación de fallo
    }
  };

  return (
    <>
      <button
        onClick={handleRestart}
        className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-amber-600 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:bg-amber-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
      >
        Reiniciar
      </button>

      <button
        onClick={handleDisconnect}
        className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:bg-red-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
      >
        Desconectar
      </button>

    </>
  );
};

export default ButtonControl;
