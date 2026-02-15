
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Student } from "@/lib/api";
import { Loader2, Plus, Edit, Trash, Search, Save, X } from "lucide-react";
import { MultiSelect } from "@/components/ui/MultiSelect";

const AVAILABLE_DOMAINS = [
    "Event Planning",
    "Logistics",
    "Marketing",
    "Art",
    "Literature",
    "Volunteer",
    "Video & Photo Editing",
    "Anchoring",
    "Dance",
    "Music",
    "AI/ML",
    "Data analyst"
];

export default function AdminDashboardPage() {
    const router = useRouter();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(null);

    // Auth State
    const [role, setRole] = useState<string | null>(null);
    const [adminDomain, setAdminDomain] = useState<string | null>(null);

    // Domain Admin State
    const [meetLink, setMeetLink] = useState("");
    const [domainUpdateStatus, setDomainUpdateStatus] = useState("");

    useEffect(() => {
        const isAuth = sessionStorage.getItem("adminAuth");
        const storedRole = sessionStorage.getItem("adminRole");
        const storedDomain = sessionStorage.getItem("adminDomain");

        if (!isAuth) {
            router.push("/admin/login");
            return;
        }

        setRole(storedRole);
        setAdminDomain(storedDomain);

        if (storedRole === "super_admin") {
            fetchStudents();
        } else if (storedRole === "domain_admin" && storedDomain) {
            fetchDomainDetails(storedDomain);
        } else {
            setLoading(false); // Should not happen, but stop loading
        }
    }, [router]);

    const fetchStudents = async () => {
        try {
            const res = await fetch("/api/students");
            const data = await res.json();
            setStudents(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchDomainDetails = async (domainName: string) => {
        try {
            const res = await fetch("/api/domains");
            const data = await res.json();
            const myDomain = data.find((d: any) => d.name === domainName);
            if (myDomain) {
                setMeetLink(myDomain.meetLink);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDomainUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setDomainUpdateStatus("Saving...");
        try {
            const res = await fetch("/api/domains", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: adminDomain, meetLink })
            });
            if (res.ok) {
                setDomainUpdateStatus("Link updated successfully!");
                setTimeout(() => setDomainUpdateStatus(""), 3000);
            } else {
                setDomainUpdateStatus("Failed to update.");
            }
        } catch (e) {
            setDomainUpdateStatus("Error updating link.");
        }
    };

    // ... (Keep existing handlers: filteredStudents, handleSave, handleDelete) ...
    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNo.includes(searchTerm)
    );

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStudent) return;

        try {
            const res = await fetch("/api/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingStudent)
            });

            if (res.ok) {
                setEditingStudent(null);
                fetchStudents();
            }
        } catch (e) {
            alert("Failed to save");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`/api/students?id=${id}`, { method: "DELETE" });
            fetchStudents();
        } catch (e) {
            alert("Failed to delete");
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        router.push("/");
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;

    // RENDER: Domain Admin View
    if (role === "domain_admin") {
        return (
            <div className="min-h-screen p-6 bg-slate-950 text-white flex items-center justify-center">
                <GlassCard className="w-full max-w-lg p-8 space-y-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <div>
                            <h1 className="text-2xl font-bold">{adminDomain} Admin</h1>
                            <p className="text-sm text-slate-400">Manage your domain settings</p>
                        </div>
                        <Button variant="danger" onClick={handleLogout}>Logout</Button>
                    </div>

                    <form onSubmit={handleDomainUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Google Meet Link</label>
                            <Input
                                value={meetLink}
                                onChange={(e) => setMeetLink(e.target.value)}
                                placeholder="https://meet.google.com/..."
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            <Save className="w-4 h-4 mr-2" /> Update Link
                        </Button>
                        {domainUpdateStatus && (
                            <p className={`text-center text-sm ${domainUpdateStatus.includes("Success") ? "text-green-400" : "text-blue-400"}`}>
                                {domainUpdateStatus}
                            </p>
                        )}
                    </form>
                </GlassCard>
            </div>
        );
    }

    // RENDER: Super Admin View (Existing Dashboard)
    return (
        <div className="min-h-screen p-6 bg-slate-950 text-white">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
                    <div className="flex gap-2">
                        <Button onClick={() => setEditingStudent({ name: "", rollNo: "", email: "", domains: [] })}>
                            <Plus className="w-4 h-4 mr-2" /> Add Student
                        </Button>
                        <Button variant="danger" onClick={handleLogout}>Logout</Button>
                    </div>
                </div>

                <GlassCard className="p-4 flex gap-4">
                    <Search className="text-slate-400" />
                    <input
                        className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
                        placeholder="Search by Name or Roll No..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </GlassCard>

                <div className="grid gap-4">
                    {filteredStudents.map(student => (
                        <GlassCard key={student.id} className="p-4 flex items-center justify-between group hover:bg-white/5">
                            <div>
                                <div className="font-bold text-lg">{student.name}</div>
                                <div className="text-sm text-slate-400">Roll: {student.rollNo} | {student.email}</div>
                                <div className="text-xs text-blue-400 mt-1">{student.domains.join(", ")}</div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="secondary" onClick={() => setEditingStudent(student)}><Edit className="w-4 h-4" /></Button>
                                <Button variant="danger" onClick={() => handleDelete(student.id)}><Trash className="w-4 h-4" /></Button>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>

            {editingStudent && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <GlassCard className="w-full max-w-lg p-6 space-y-4 bg-slate-900 border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{editingStudent.id ? "Edit Student" : "New Student"}</h2>
                            <button onClick={() => setEditingStudent(null)}><X className="w-6 h-6 text-slate-400" /></button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Name</label>
                                <Input
                                    value={editingStudent.name}
                                    onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Roll No</label>
                                    <Input
                                        value={editingStudent.rollNo}
                                        onChange={e => setEditingStudent({ ...editingStudent, rollNo: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Email</label>
                                    <Input
                                        value={editingStudent.email}
                                        onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Domains</label>
                                <MultiSelect
                                    options={AVAILABLE_DOMAINS}
                                    selected={editingStudent.domains || []}
                                    onChange={(selected) => setEditingStudent({ ...editingStudent, domains: selected })}
                                />
                            </div>
                            <Button type="submit" className="w-full mt-4">
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                        </form>
                    </GlassCard>
                </div>
            )}
        </div>
    );
}
