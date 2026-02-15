
"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Calendar, Video, Clock } from "lucide-react";
import Link from "next/link";

interface DomainCardProps {
    domain: string;
    timeSlot?: string;
    meetLink?: string;
}

export function DomainCard({ domain, timeSlot, meetLink }: DomainCardProps) {
    // Placeholder Meet Link Logic if not provided
    const finalMeetLink = meetLink || `https://meet.google.com/lookup/${domain.replace(/\s+/g, '-').toLowerCase()}`;

    // If we have an explicit meetLink prop, we assume it's valid and allow joining.
    // Otherwise, we only allow joining if a timeSlot is assigned (legacy logic).
    const canJoin = !!meetLink || !!timeSlot;

    return (
        <GlassCard hoverEffect className="flex flex-col justify-between h-full min-h-[200px] border-l-4 border-l-blue-500">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white tracking-wide">{domain}</h3>
                    <div className={`h-2 w-2 rounded-full ${canJoin ? 'bg-green-500' : 'bg-yellow-500'} shadow-[0_0_10px_currentColor]`} />
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center text-slate-300">
                        <Clock className="w-4 h-4 mr-2 text-blue-400" />
                        <span className="text-sm font-medium">
                            {timeSlot || "Time Pending / To Be Announced"}
                        </span>
                    </div>
                    <div className="flex items-center text-slate-300">
                        <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                        <span className="text-sm">Feb 15, 2026</span>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                {!canJoin ? (
                    <Button disabled variant="secondary" className="w-full opacity-50 cursor-not-allowed">
                        Wait for Schedule
                    </Button>
                ) : (
                    <Link href={finalMeetLink} target="_blank" className="w-full block">
                        <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500">
                            <Video className="w-4 h-4 mr-2" />
                            Join Meet
                        </Button>
                    </Link>
                )}
            </div>
        </GlassCard>
    );
}
