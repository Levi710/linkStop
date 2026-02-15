
import fs from 'fs';
import path from 'path';
import studentsData from '@/data/students.json';
import scheduleData from '@/data/schedule.json';

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

export const getStudents = async (): Promise<Student[]> => {
    // In production (Vercel), we rely on the bundled import to avoid 404s from missing loose files.
    // In development, we can try to read from FS to see live updates from the Admin panel.
    if (process.env.NODE_ENV === 'development') {
        try {
            if (fs.existsSync(studentsFile)) {
                const data = fs.readFileSync(studentsFile, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.warn("Failed to read from FS, falling back to bundled data:", error);
        }
    }
    return studentsData as Student[];
};

export const getSchedule = async (): Promise<ScheduleItem[]> => {
    if (process.env.NODE_ENV === 'development') {
        try {
            if (fs.existsSync(scheduleFile)) {
                const data = fs.readFileSync(scheduleFile, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.warn("Failed to read from FS, falling back to bundled data:", error);
        }
    }
    return scheduleData as ScheduleItem[];
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

export const saveStudents = async (students: Student[]) => {
    // This will only work if the file system is writable and the path exists (Local Dev)
    try {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(studentsFile, JSON.stringify(students, null, 2));
    } catch (error) {
        console.error("Failed to save students (Expected on Vercel):", error);
    }
};

export const saveSchedule = async (schedule: ScheduleItem[]) => {
    try {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(scheduleFile, JSON.stringify(schedule, null, 2));
    } catch (error) {
        console.error("Failed to save schedule (Expected on Vercel):", error);
    }
};

// Domain Admin Features
import domainsData from '@/data/domains.json';
const domainsFile = path.join(dataDir, 'domains.json');

export type DomainConfig = {
    name: string;
    password?: string; // Optional because we might not want to expose it to client always, though here we trust API.
    meetLink: string;
};

export const getDomains = async (): Promise<DomainConfig[]> => {
    if (process.env.NODE_ENV === 'development') {
        try {
            if (fs.existsSync(domainsFile)) {
                const data = fs.readFileSync(domainsFile, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.warn("Failed to read domains from FS, using bundled:", error);
        }
    }
    return domainsData as DomainConfig[];
};

export const saveDomains = async (domains: DomainConfig[]) => {
    try {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(domainsFile, JSON.stringify(domains, null, 2));
    } catch (error) {
        console.error("Failed to save domains:", error);
    }
};
