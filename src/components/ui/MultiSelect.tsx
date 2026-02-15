"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
}

export function MultiSelect({ options, selected, onChange, placeholder = "Select options..." }: MultiSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter((item) => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const removeOption = (e: React.MouseEvent, option: string) => {
        e.stopPropagation();
        onChange(selected.filter((item) => item !== option));
    };

    return (
        <div className="relative" ref={ref}>
            <div
                className="min-h-[42px] w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex flex-wrap gap-2 items-center cursor-pointer hover:border-white/20 transition-colors"
                onClick={() => setOpen(!open)}
            >
                {selected.length === 0 && (
                    <span className="text-slate-500">{placeholder}</span>
                )}
                {selected.map((item) => (
                    <span
                        key={item}
                        className="bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 px-2 py-0.5 rounded-md text-xs flex items-center gap-1"
                    >
                        {item}
                        <X
                            className="w-3 h-3 hover:text-white transition-colors"
                            onClick={(e) => removeOption(e, item)}
                        />
                    </span>
                ))}
                <div className="ml-auto">
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto"
                    >
                        {options.map((option) => (
                            <div
                                key={option}
                                className={cn(
                                    "flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-white/5 transition-colors",
                                    selected.includes(option) ? "text-cyan-400 bg-cyan-500/10" : "text-slate-300"
                                )}
                                onClick={() => toggleOption(option)}
                            >
                                <div className={cn(
                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-slate-600",
                                    selected.includes(option) ? "bg-cyan-500 border-cyan-500 text-black" : "opacity-50 [&_svg]:invisible"
                                )}>
                                    <Check className={cn("h-3 w-3")} />
                                </div>
                                {option}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
