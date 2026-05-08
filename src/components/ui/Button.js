import { cn } from "@/lib/utils";

export default function Button({ children, className, variant = "primary", ...props }) {
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-tertiary-fixed hover:text-primary",
    secondary: "bg-transparent text-primary hairline-all hover:bg-surface-variant",
    danger: "bg-error text-on-error hover:bg-error/80",
    ghost: "bg-transparent text-primary hover:bg-surface-variant",
  };

  return (
    <button
      className={cn(
        "font-label-caps text-label-caps px-6 py-4 transition-colors uppercase flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}