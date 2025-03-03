import React from "react";
import { Input } from "@heroui/input";

interface CinputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    classType?: "primary" | "secondary" | "inputPrimary";
    className?: string;  // Añadido explícitamente para mayor claridad
}

// Definición de estilos similares a los de Cbutton.jsx
const styles = {
    primary: {
        className: "border border-[var(--app-primary)] p-2 rounded",
    },
    secondary: {
        className: "border border-[var(--app-secondary)] p-2 rounded",
    },
    inputPrimary: {
        className: "border border-primary-500 p-2 rounded",
    },
};

export default function Cinput({
    classType,
    className,
    ...props
}: CinputProps) {
    // Combinar las clases del classType con las clases personalizadas si existen
    const inputClass = classType 
        ? [styles[classType].className, className].filter(Boolean).join(" ")
        : className || "";  // Si no hay classType, usar className o cadena vacía

    return (
        <Input
            className={inputClass}
            {...props}
        />
    );
}