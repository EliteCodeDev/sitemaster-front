import React from "react";
import {
    InformationCircleIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";

type Props = {
    children: React.ReactNode;
    variant?: "primary" | "success" | "error" | "warning";
    radius?: string;
    className?: string;
    icon?: React.ReactNode;
    closable?: boolean;
    onClose?: () => void;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
};

const Alert: React.FC<Props> = ({
    children,
    variant = "primary",
    radius = "lg",
    className = "",
    icon,
    closable = false,
    onClose,
    startContent,
    endContent,
}) => {
    const styles = {
        primary: {
            className: "bg-blue-100 text-blue-800",
            IconComponent: InformationCircleIcon,
        },
        success: {
            className: "bg-green-100 text-green-800",
            IconComponent: CheckCircleIcon,
        },
        error: {
            className: "bg-red-100 text-red-800",
            IconComponent: XCircleIcon,
        },
        warning: {
            className: "bg-yellow-100 text-yellow-800",
            IconComponent: ExclamationTriangleIcon,
        },
    };

    const variantStyle = styles[variant] || styles.primary;

    return (
        <div
            className={`p-4 rounded-${radius} ${variantStyle.className} ${className}`}
        >
            <div className="flex items-center">
                {icon ? (
                    <span className="mr-2">{icon}</span>
                ) : (
                    variantStyle.IconComponent && (
                        <variantStyle.IconComponent className="mr-2 h-6 w-6" />
                    )
                )}

                {startContent && <div className="mr-2">{startContent}</div>}

                <div className="flex-1">{children}</div>

                {endContent && <div className="ml-2">{endContent}</div>}

                {closable && (
                    <button
                        onClick={onClose}
                        className="ml-2 focus:outline-none"
                        aria-label="Close"
                    >
                        <XMarkIcon className="h-6 w-6 text-current" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Alert;