
import { getStudentByRollNo, getDomains } from "@/lib/api";
import { GlassCard } from "@/components/ui/GlassCard";
import { DomainCard } from "@/components/DomainCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, User, Mail, Hash } from "lucide-react";
import { notFound } from "next/navigation";

export default async function DashboardPage({ params }: { params: Promise<{ rollNo: string }> }) {
    const { rollNo } = await params;
    const student = await getStudentByRollNo(rollNo);
    const allDomains = await getDomains();

    if (!student) {
        notFound();
    }

    // Extract times if available
    const scheduleTimes = student.schedule?.times || [];
    const domains = student.domains || [];

    return (
        <main className="min-h-screen p-6 sm:p-12 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-cyan-600/10 blur-[120px] -z-10" />
            <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <Link href="/">
                        <Button variant="secondary" className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Button>
                    </Link>
                    <div className="text-right">
                        <h1 className="text-2xl font-bold text-white mb-1">{student.name}</h1>
                        <div className="flex items-center justify-end gap-3 text-sm text-slate-400">
                            <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> {student.rollNo}</span>
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {student.email}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {domains.map((domain, index) => {
                        let timeSlot = undefined;
                        if (index < scheduleTimes.length) {
                            timeSlot = scheduleTimes[index];
                        }

                        // Find config for this domain to get the Meet Link
                        const domainConfig = allDomains.find(d => d.name === domain);
                        const meetLink = domainConfig?.meetLink;

                        return (
                            <DomainCard
                                key={index}
                                domain={domain}
                                timeSlot={timeSlot}
                                meetLink={meetLink}
                            />
                        );
                    })}
                </div>

                {/* If the student has a schedule line but no domains? Rare/Impossible logic but good to handle */}
                {domains.length === 0 && (
                    <GlassCard className="text-center py-12">
                        <h2 className="text-xl text-slate-300">No domains assigned yet.</h2>
                    </GlassCard>
                )}

                {/* Raw Schedule Debug Info (Optional, maybe hidden or for Admin) */}
                {/* 
            <GlassCard className="mt-8 p-4 bg-black/20 text-xs text-slate-500 font-mono">
                Debug: {student.schedule?.rawLine}
            </GlassCard> 
            */}
            </div>
        </main>
    );
}
