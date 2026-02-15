
import { RollNumberForm } from "@/components/RollNumberForm";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[100px]" />
      </div>

      <div className="z-10 w-full max-w-3xl flex flex-col items-center text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 drop-shadow-sm">
            Student Domain <br /> Platform
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Access your assigned domains, schedule, and meeting secure links in one unified workspace.
          </p>
        </div>

        <GlassCard className="w-full max-w-lg p-8 sm:p-12 backdrop-blur-xl bg-white/5 border-white/10">
          <RollNumberForm />
        </GlassCard>

        <footer className="mt-16 text-sm text-slate-500">
          © 2026 Student Domain Management. <Link href="/admin/login" className="hover:text-slate-300 transition-colors underline decoration-slate-700 underline-offset-4">Admin Login</Link>
        </footer>
      </div>
    </main>
  );
}

