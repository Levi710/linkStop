
import { getStudentByRollNo } from "@/lib/api";
import { GlassCard } from "@/components/ui/GlassCard";
import { DomainCard } from "@/components/DomainCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, User, Mail, Hash } from "lucide-react";
import { notFound } from "next/navigation";

export default async function DashboardPage({ params }: { params: { rollNo: string } }) {
    const student = await getStudentByRollNo(params.rollNo);

    if (!student) {
        notFound();
    }

    // Extract times if available
    // student.schedule.rawLine might contain times.
    // student.schedule.times is an array of times found in the line.
    // But we need to map them to domains. 
    // The prompt implies a 1:1 mapping was desired but the data is raw.
    // We'll use a best-effort approach: 
    // If we have times, we assign them sequentially to the domains that typically have times? 
    // OR just show all assigned domains, and if we have times, list them in the "Schedule" section?
    // The user said: "assign mapping for roll no.s as each user write their roll no. and then link for meet and aloted time will be shown"

    // Let's look at the domains the student has.
    // And look at the times found in the schedule.
    // If schedule has 1 time, and student has 1 domain -> match.
    // If schedule has 2 times, and student has 2 domains... match sequentially.
    // If mismatches, label "See Schedule Details".

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
                        // Try to map a time to this domain
                        // This is heuristic-based because the source data didn't have explicit domain-time mapping, just a list of times in columns.
                        // We'll trust the order: first time for first domain in the schedule columns, but here we just have 'domains' list.
                        // We'll just grab the time at 'index' if available, otherwise 'Pending'

                        // Actually the domains in `student.domains` might be sorted differently than the schedule columns.
                        // But for this prototype, we will map sequentially.
                        // IMPORTANT: Limit to available times. 
                        let timeSlot = undefined;
                        if (index < scheduleTimes.length) {
                            timeSlot = scheduleTimes[index];
                        }

                        return (
                            <DomainCard
                                key={index}
                                domain={domain}
                                timeSlot={timeSlot}
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
