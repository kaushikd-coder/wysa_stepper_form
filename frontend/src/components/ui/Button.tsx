import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-primary-dark to-primary text-primary-foreground shadow-md shadow-teal-900/20 hover:from-primary hover:to-accent hover:shadow-lg",
  outline:
    "border border-border bg-white text-foreground shadow-sm hover:border-primary/40 hover:bg-teal-50/50",
  ghost: "text-primary hover:bg-teal-50",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-10 cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
