import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "outlined" | "elevated";
}

export function Card({ children, className, variant = "default" }: CardProps) {
  const variants = {
    default: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    outlined: "bg-transparent border-2 border-gray-300 dark:border-gray-600",
    elevated: "bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
  };

  return (
    <div className={cn(
      "rounded-lg p-6 transition-colors",
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-900 dark:text-white", className)}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn("text-gray-600 dark:text-gray-300", className)}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn("mt-4 pt-4 border-t border-gray-200 dark:border-gray-700", className)}>
      {children}
    </div>
  );
}
