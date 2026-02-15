
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            });
            const data = await res.json();

            if (data.success) {
                // Store auth details
                sessionStorage.setItem("adminAuth", "true");
                sessionStorage.setItem("adminRole", data.role);
                if (data.domainName) {
                    sessionStorage.setItem("adminDomain", data.domainName);
                } else {
                    sessionStorage.removeItem("adminDomain");
                }

                router.push("/admin/dashboard");
            } else {
                setError(data.error || "Invalid password");
            }
        } catch (err) {
            setError("Login failed. Try again.");
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
