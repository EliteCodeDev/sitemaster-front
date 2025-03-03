import React from "react";
import { Button } from "@heroui/button";

export default function Cbutton({
  children, // Se agrega children
  classType,
  className,
  isLoading,
  isSubmitting,
  type,
  radius,
  onClick,
}) {
  const styles = {
    primary: {
      className:
        "bg-[var(--app-primary)] hover:bg-[var(--app-primary)] focus:ring-[var(--app-primary)] text-white w-full",
    },
    secondary: {
      className: "bg-secondary-500 text-white",
    },
    buttonPrimary: {
      className: "bg-primary-500 text-white",
    },
  };

  return (
    <Button
      radius={radius ?? "lg"}
      className={classType ? styles[classType].className : className}
      type={type}
      isLoading={isLoading}
      disabled={isSubmitting} // Deshabilitar el botón si se está enviando el formulario
      onPress={onClick}
    >
      {children}
    </Button>
  );
}
