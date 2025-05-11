import React from "react";
import { cn } from "@/lib/utils"; // تأكد من وجود هذه الدالة في مشروعك

const variantClasses = {
  default: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  success: "bg-green-500 text-white",
  warning: "bg-yellow-400 text-black",
  danger: "bg-red-600 text-white",
  outline: "border border-gray-300 text-gray-800",
};

export function Badge({ children, variant = "default", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1.5 text-xs font-semibold",
        variantClasses[variant] || variantClasses.default,
        className
      )}
    >
      {children}
    </span>
  );
}
