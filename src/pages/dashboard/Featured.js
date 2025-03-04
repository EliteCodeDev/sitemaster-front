import { useSession } from 'next-auth/react';

export default function Example() {
    const { data: session } = useSession();
    const email = session?.user?.email || '';
    const checkoutUrl = `https://wazend.net/checkouts/checkout/?aero-add-to-checkout=9390&aero-qty=1&billing_email=${encodeURIComponent(email)}`;

    const cards = [
        {
            title: "🎉 Activa tus 30 días gratis",
            description: "¿Fuiste parte del Master de Inteligencia Artificial? Activa tu prueba gratis en el botón de abajo.",
            buttonText: "Activar prueba gratis",
            buttonUrl: checkoutUrl,
            buttonColor: "bg-[var(--app-primary)] hover:bg-[var(--app-primary-hovered)] focus-visible:outline-[var(--app-primary)]"
        },
        {
            title: "🛟 ¿Necesitas tutoriales?",
            description: "Hemos creado un canal de YouTube en donde creamos contenido de automatización gratuito para que le saques el juego a Wazend.",
            buttonText: "Ir al canal de YouTube",
            buttonUrl: "https://www.youtube.com/@wazend-es",
            buttonColor: "bg-[var(--app-primary)] hover:bg-[var(--app-primary-hovered)] focus-visible:outline-[var(--app-primary)]"
        }
    ];

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            {cards.map((card, index) => (
                <div key={index} className="flex flex-col bg-white rounded-xl p-6 shadow-lg gap-4">
                    <p className="text-xl font-semibold tracking-tight text-gray-950">{card.title}</p>
                    <p className="text-base text-gray-600">{card.description}</p>
                    <a
                        href={card.buttonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-2 w-full text-center rounded-lg px-4 py-3 text-base font-semibold text-white shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${card.buttonColor}`}
                    >
                        {card.buttonText}
                    </a>
                </div>
            ))}
        </div>
    );
}
