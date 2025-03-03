import React from "react";
import { Button, ButtonGroup } from "@heroui/button";

const styles = {
  primary: {
    className:
      "bg-[var(--app-primary)] hover:bg-[var(--app-primary-hovered)] focus:ring-[var(--app-primary)] button-global text-[var(--button-text-color)]",
  },
  secondary: {
    className:
      "bg-[var(--app-secondary)] hover:bg-[var(--app-secondary)] focus:ring-[var(--app-secondary)] button-global text-[var(--button-text-color)]",
  },
  auth: {
    className:
      "flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent",
  },
  settings: {
    className: "bg-white border-1",
  },
  header: {
    className: "flex items-center justify-center gap-2 text-sm font-semibold",
  },
};

export default function Cbutton({
  children, // Se agrega children
  classType,
  className,
  isLoading,
  isSubmitting,
  type,
  radius,
  onClick,
  startContent,
  endContent,
  key,
  variant,
}) {
  return (
    <Button
      key={key}
      radius={radius ?? "lg"}
      className={`${classType ? styles[classType].className : ""} ${
        className || ""
      }`}
      type={type}
      isLoading={isLoading}
      disabled={isSubmitting} // Deshabilitar el botón si se está enviando el formulario
      onPress={onClick}
      startContent={startContent}
      endContent={endContent}
      variant={variant}
    >
      {children}
    </Button>
  );
}
