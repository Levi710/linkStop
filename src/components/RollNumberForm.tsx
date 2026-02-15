
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function RollNumberForm() {
    const [rollNo, setRollNo] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rollNo.trim()) return;

        setLoading(true);
        // Simulate a small delay for effect or validation
        setTimeout(() => {
            router.push(`/dashboard/${rollNo.trim()}`);
        }, 500);
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full max-w-md mx-auto"
        >
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 blur"></div>
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Enter your Roll Number (e.g., 2305173)"
                        value={rollNo}
                        onChange={(e) => setRollNo(e.target.value)}
                        className="bg-black/80 border-white/10 text-lg h-14"
                        disabled={loading}
                    />
                </div>
            </div>
            <Button
                type="submit"
                className="h-14 text-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-blue-500/20"
                disabled={loading || !rollNo}
            >
                {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    <>
                        Check Schedule <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                )}
            </Button>
        </motion.form>
    );
}
