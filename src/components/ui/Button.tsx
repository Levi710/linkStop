
"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", ...props }, ref) => {
        const baseStyles = "relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

        const variants = {
            primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)]",
            secondary: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10",
            danger: "bg-red-500/80 hover:bg-red-600 text-white"
        };

        // Cast as any to bypass strict HTMLMotionProps vs ButtonHTMLAttributes mismatch
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const MButton = motion.button as any;

        return (
            <MButton
                whileTap={{ scale: 0.95 }}
                ref={ref}
                className={cn(baseStyles, variants[variant], className)}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
