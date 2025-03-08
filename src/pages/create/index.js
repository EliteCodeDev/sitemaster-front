import Layout from '@/components/layout/dashboard'
import { useState } from 'react'
import MultiStepForm from '@/components/interfaz/website/MultiStepForm'
import { websiteCreatorSchema } from '@/lib/stepSchema'
import { useSession } from 'next-auth/react';
import Cbutton from '@/components/interfaz/Cbutton';
import { strapiUrl } from '@/routes/routes';
import { useRouter } from 'next/router';
import { toast } from 'sonner'; // Assuming you're using react-hot-toast for notifications

export default function Index() {
  const [formData, setFormData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  // Define the form steps configuration
  const formSteps = [
    {
      id: "basic-info",
      title: "Información General",
      description: "Comencemos con lo básico de tu sitio web",
      fields: [
        {
          name: "websiteName",
          label: "Website Name",
          type: "text",
          placeholder: "e.g. Mi sitio web",
          required: true,
        },
        {
          name: "purpose",
          label: "¿Qué te gustaría hacer con tu sitio web?",
          type: "select",
          options: [
            { value: "business", label: "Negocios" },
            { value: "personal", label: "Tener un sitio web personal" },
            { value: "portfolio", label: "Crear un portfolio profesional" },
            { value: "ecommerce", label: "Crear mi propia E-commerce" },
            { value: "blog", label: "Blog" },
          ],
          required: true,
        },
        {
          name: "description",
          label: "Breve Descripción",
          type: "textarea",
          placeholder: "Describe de qué trata tu sitio web...",
          required: true,
        },
      ],
    },
    {
      id: "domain",
      title: "Elige tu Dominio",
      description: "¿Tienes un dominio en mente?",
      fields: [
        {
          name: "domainName",
          label: "Nombre",
          type: "text",
          placeholder: "e.g. misitio.com",
          required: true,
        },
        {
          name: "domainExtension",
          label: "Extensión",
          type: "select",
          options: [
            { value: ".com", label: ".com" },
            { value: ".net", label: ".net" },
            { value: ".org", label: ".org" },
            { value: ".io", label: ".io" },
            { value: ".dev", label: ".dev" },
          ],
          // required: true,
        },
        {
          name: "otherExtension",
          label: "Otra Extensión",
          type: "text",
          placeholder: "Escribe tu propia extensión...",
        }
      ]
    },
    {
      id: "design",
      title: "Preferencias de Diseño",
      description: "Elige cómo debería verse tu sitio web",
      fields: [
        {
          name: "layout",
          label: "Tema de Diseño",
          type: "radio",
          options: [
            { value: "modern", label: "Moderno", default: true },
            { value: "classic", label: "Clásico" },
            { value: "minimalist", label: "Minimalista" },
            { value: "creative", label: "Creativo" },
          ],
          required: true,
        },
      ],
    },
    {
      id: "resume",
      title: "Resumen de Configuración",
      description: "Revisa tu configuración antes de continuar",
      fields: [
        {
          name: "websiteName",
          label: "Website Name",
          type: "text",
          readonly: true,
        },
        {
          name: "purpose",
          label: "Purpose",
          type: "text",
          readonly: true,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          readonly: true,
        },
        {
          name: "domainName",
          label: "Domain Name",
          type: "text",
          readonly: true,
        },
        {
          name: "domainExtension",
          label: "Domain Extension",
          type: "text",
          readonly: true,
        },
        {
          name: "otherExtension",
          label: "Otra Extensión",
          type: "text",
          readonly: true,
        },
        {
          name: "layout",
          label: "Layout",
          type: "text",
          readonly: true,
        },
      ],
    }
  ]

  const saveWebsite = async (requestData) => {
    try {
      setIsSubmitting(true);

      // Extract only the data property from the full requestData
      const { data } = requestData;

      // Add default values for required fields that might be missing
      const websiteData = {
        ...data,
        isActive: true,
        // Add any other default fields here if needed
      };

      const response = await fetch(`${strapiUrl}/api/websites`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: websiteData }),
      });

      if (response.ok) {
        toast.success('El sitio web ha sido creado exitosamente.');
        // Redirect to home page
        router.replace('/');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error?.message || 'Error al crear el sitio web.');
        console.error('Error creating website:', errorData);
      }
    } catch (error) {
      toast.error('Hubo un error al procesar tu solicitud.');
      console.error('Exception when creating website:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (data) => {
    const requestData = {
      data: data,
      user: {
        id: session?.id || "ID no disponible",
        email: session?.user?.email || "correoejemplo@gmail.com"
      }
    }
    setFormData(requestData)
    console.log("Form submitted with data:", data)

    // Save the website data
    saveWebsite(requestData);
  }

  return (
    <Layout>
      <main className="container mx-auto py-10 px-4">
        {formData && !isSubmitting ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
              <h2 className="text-xl font-semibold text-green-800 mb-2">Website Configuration Complete!</h2>
              <p className="text-green-700">
                Your website configuration has been saved. Here's a summary of your choices:
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
              <h3 className="text-lg font-medium mb-4">Configuration JSON:</h3>
              <pre className="bg-gray-50 p-4 rounded border overflow-x-auto text-sm">
                {JSON.stringify(formData, null, 2)}
              </pre>

              <div className="mt-6 flex justify-end">
                <Cbutton
                  onClick={() => setFormData(null)}
                  classType="primary"
                  disabled={isSubmitting}
                >
                  Create Another Website
                </Cbutton>
              </div>
            </div>
          </div>
        ) : (
          <MultiStepForm
            steps={formSteps}
            onSubmit={handleFormSubmit}
            validationSchema={websiteCreatorSchema}
            isSubmitting={isSubmitting}
          />
        )}

        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-lg">Guardando tu sitio web...</p>
            </div>
          </div>
        )}
      </main>
    </Layout>
  )
}