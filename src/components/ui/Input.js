import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Input = forwardRef(({ className, label, type = "text", ...props }, ref) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="font-label-caps text-label-caps text-on-surface-variant mb-2">
          {label.toUpperCase()}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "bg-transparent border-none hairline-b font-body-lg text-body-lg text-primary focus:ring-0 p-4 placeholder-outline-variant w-full focus:outline-none transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";

export { Input };