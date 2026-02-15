
import { getStudents, saveStudents, Student } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET() {
    const students = await getStudents();
    return NextResponse.json(students);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const students = await getStudents();

        const { id, ...data } = body;
        const newStudentData = data as Partial<Student>;

        const updatedStudents = [...students];
        const existingIndex = students.findIndex((s) => s.id === id);

        if (existingIndex > -1) {
            updatedStudents[existingIndex] = { ...students[existingIndex], ...newStudentData };
        } else {
            const newStudent: Student = {
                id: id || Math.random().toString(36).substr(2, 9),
                name: newStudentData.name || "",
                rollNo: newStudentData.rollNo || "",
                email: newStudentData.email || "",
                domains: newStudentData.domains || []
            };
            updatedStudents.push(newStudent);
        }

        await saveStudents(updatedStudents);
        return NextResponse.json({ success: true, students: updatedStudents });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update students" }, { status: 500 });
    }
}

// DELETE Handler
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const students = await getStudents();
        const updatedStudents = students.filter(s => s.id !== id);

        await saveStudents(updatedStudents);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
