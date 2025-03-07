import Layout from '@/components/layout/dashboard'
import { useState } from 'react'
import MultiStepForm from '@/components/interfaz/website/MultiStepForm'
import { websiteCreatorSchema } from '@/lib/stepSchema'
import { id } from 'date-fns/locale'
import { useSession } from 'next-auth/react';
import Cbutton from '@/components/interfaz/Cbutton';
export default function Index() {
  const [formData, setFormData] = useState(null)
  const { data: session } = useSession()

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
        // {
        //   name: "domainPurpose",
        //   label: "¿Qué esperas lograr con tu dominio?",
        //   type: "textarea",
        //   placeholder: "Describe tus expectativas...",
        // },
      ]
    },
    {
      id: "design",
      title: "Preferencias de Diseño",
      description: "Elige cómo debería verse tu sitio web",
      fields: [
        // {
        //   name: "colorScheme",
        //   label: "Esquema de Colores",
        //   type: "select",
        //   options: [
        //     { value: "light", label: "Claro" },
        //     { value: "dark", label: "Oscuro" },
        //     { value: "colorful", label: "Colorido" },
        //     { value: "minimal", label: "Minimalista" },
        //   ],
        //   required: true,
        // },
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
        // {
        //   name: "features",
        //   label: "Características Especiales",
        //   type: "checkbox",
        //   options: [
        //     { value: "animations", label: "Animaciones" },
        //     { value: "darkMode", label: "Modo Oscuro" },
        //     { value: "multilingual", label: "Soporte Multilingüe" },
        //     { value: "accessibility", label: "Características de Accesibilidad" },
        //   ],
        // },
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
  }

  return (
    <Layout>
      <main className="container mx-auto py-10 px-4">
        {/* <h1 className="text-3xl font-bold text-center mb-8">Website Creator</h1> */}

        {formData ? (
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
                >
                  Create Another Website
                </Cbutton>
              </div>
            </div>
          </div>
        ) : (
          <MultiStepForm steps={formSteps} onSubmit={handleFormSubmit} validationSchema={websiteCreatorSchema} />
        )}
      </main>
    </Layout>
  )
}

