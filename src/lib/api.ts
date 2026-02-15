
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src/data');
const studentsFile = path.join(dataDir, 'students.json');
const scheduleFile = path.join(dataDir, 'schedule.json');

export type Student = {
    id: string;
    name: string;
    rollNo: string;
    email: string;
    domains: string[];
};

export type ScheduleItem = {
    rollNo: string;
    name: string;
    rawLine: string;
    times: string[];
};

// Helper to ensure data directory exists (should be there normally)
const ensureData = () => {
    if (!fs.existsSync(dataDir)) {
        // fail gracefully or create?
    }
};

export const getStudents = async (): Promise<Student[]> => {
    try {
        const data = fs.readFileSync(studentsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading students:", error);
        return [];
    }
};

export const getSchedule = async (): Promise<ScheduleItem[]> => {
    try {
        const data = fs.readFileSync(scheduleFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading schedule:", error);
        return [];
    }
}

export const getStudentByRollNo = async (rollNo: string) => {
    const students = await getStudents();
    const schedule = await getSchedule();

    const student = students.find(s => s.rollNo === rollNo);
    if (!student) return null;

    const studentSchedule = schedule.find(s => s.rollNo === rollNo);

    return {
        ...student,
        schedule: studentSchedule
    };
};

// For Admin writes
export const saveStudents = async (students: Student[]) => {
    fs.writeFileSync(studentsFile, JSON.stringify(students, null, 2));
};

export const saveSchedule = async (schedule: ScheduleItem[]) => {
    fs.writeFileSync(scheduleFile, JSON.stringify(schedule, null, 2));
};
