
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Student } from "@/lib/api";
import { Loader2, Plus, Edit, Trash, Search, Save, X } from "lucide-react";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(null);

    useEffect(() => {
        const isAuth = sessionStorage.getItem("adminAuth");
        if (!isAuth) {
            router.push("/admin/login");
            return;
        }
        fetchStudents();
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

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNo.includes(searchTerm)
    );

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStudent) return;

        // Parse domains from comma separated string if strictly string input
        // But here we might bind directly.
        // For simplicity, let's assume domains is managed as a string in the form.

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

    if (loading) return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen p-6 bg-slate-950 text-white">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <Button onClick={() => setEditingStudent({ name: "", rollNo: "", email: "", domains: [] })}>
                        <Plus className="w-4 h-4 mr-2" /> Add Student
                    </Button>
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
                                <label className="text-sm text-slate-400">Domains (comma separated)</label>
                                <Input
                                    value={editingStudent.domains?.join(", ")}
                                    onChange={e => setEditingStudent({ ...editingStudent, domains: e.target.value.split(',').map(s => s.trim()) })}
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
