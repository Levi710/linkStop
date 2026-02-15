
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "admin123") {
            // Store auth state (simple method)
            sessionStorage.setItem("adminAuth", "true");
            router.push("/admin/dashboard");
        } else {
            setError("Invalid password");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6 bg-slate-950 text-white">
            <GlassCard className="w-full max-w-md p-8">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Lock className="text-blue-500" /> Admin Login
                </h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <Input
                            type="password"
                            placeholder="Enter Admin Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-black/50 border-white/10"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </form>
            </GlassCard>
        </div>
    );
}
