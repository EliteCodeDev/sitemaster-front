// Cinput.tsx
import React from "react";
import { Input } from "../ui/input"; // <-- input base

interface CinputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "value"> {
  classType?: "primary" | "secondary" | "inputPrimary";
  className?: string;
  // Restringimos 'value' a string o string[] (para evitar problemas con number)
  value?: string | string[];
  // Nuevo prop para definir el tamaño: "small", "medium" o "large"
  inputSize?: "small" | "medium" | "large";
}

const sizeClasses = {
  small: "py-1",
  medium: "py-3",
  large: "py-5",
};

const styles = {
  primary: {
    className: `
      mt-2
      block
      w-full
      rounded-md
      border-0
      bg-white
      text-gray-900
      shadow-sm
      ring-1
      ring-inset
      ring-gray-300
      placeholder:text-gray-400
      focus:ring-2
      focus:ring-inset
      focus:ring-[var(--app-primary)]
      focus-visible:ring-2
      focus-visible:ring-[var(--app-primary)]
      focus-visible:ring-inset
      sm:text-sm
      sm:leading-6
    `,
  },
  secondary: {
    className: `
      mt-2
      block
      w-full
      rounded-md
      border-0
      bg-white
      text-gray-900
      shadow-sm
      ring-1
      ring-inset
      ring-gray-300
      placeholder:text-gray-400
      focus:ring-2
      focus:ring-inset
      focus:ring-[var(--app-secondary)]
      focus-visible:ring-2
      focus-visible:ring-[var(--app-secondary)]
      focus-visible:ring-inset
      sm:text-sm
      sm:leading-6
    `,
  },
  inputPrimary: {
    className: `
      border
      border-0
      ring-1
      ring-inset
      ring-gray-300
      p-2
      rounded
    `,
  },
};

export default function Cinput({
  classType,
  className,
  placeholder,
  inputSize = "medium",
  ...props
}: CinputProps) {
  // Combino las clases del estilo según classType y las clases adicionales
  const baseClass = classType ? styles[classType].className : "";
  // Agrego la clase de padding de acuerdo al tamaño especificado
  const paddingClass = sizeClasses[inputSize];
  const inputClass = [baseClass, className, paddingClass].filter(Boolean).join(" ");

  return (
    <Input
      {...props}
      className={inputClass}
      placeholder={placeholder}
    />
  );
}
