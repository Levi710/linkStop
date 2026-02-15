import { query } from './db';

// --- Types ---
export type Student = {
    id: string; // Postgres ID is number, but we can cast to string if needed by frontend
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

export type DomainConfig = {
    name: string;
    password?: string;
    meetLink: string;
};

// --- Students ---
export const getStudents = async (): Promise<Student[]> => {
    try {
        const res = await query('SELECT * FROM students ORDER BY id ASC');
        // Map DB snake_case to app camelCase if needed, though we used matching names mostly
        return res.rows.map(row => ({
            id: row.id.toString(),
            name: row.name,
            rollNo: row.roll_no,
            email: row.email,
            domains: row.domains || []
        }));
    } catch (e) {
        console.error("DB Error getStudents:", e);
        return [];
    }
};

export const saveStudents = async (students: Student[]) => {
    // This function was bulk save. For DB, we usually update one by one or bulk upsert.
    // The Admin UI calls this to save the WHOLE list.
    // Efficient strategy: Transaction -> Truncate -> Insert (Simple but risky if fails)
    // Better: Upsert each.
    // given the scale (80 students), Truncate/Insert is fine for this specific app logic.
    try {
        await query('BEGIN');
        await query('TRUNCATE TABLE students CASCADE');
        for (const s of students) {
            await query(
                'INSERT INTO students (name, roll_no, email, domains) VALUES ($1, $2, $3, $4)',
                [s.name, s.rollNo, s.email, s.domains]
            );
        }
        await query('COMMIT');
    } catch (e) {
        await query('ROLLBACK');
        console.error("DB Error saveStudents:", e);
    }
};

// --- Schedule ---
export const getSchedule = async (): Promise<ScheduleItem[]> => {
    try {
        const res = await query('SELECT * FROM schedules');
        return res.rows.map(row => ({
            rollNo: row.roll_no,
            name: row.name,
            rawLine: row.raw_line,
            times: row.times || []
        }));
    } catch (e) {
        console.error("DB Error getSchedule:", e);
        return [];
    }
};

export const saveSchedule = async (schedule: ScheduleItem[]) => {
    try {
        await query('BEGIN');
        await query('TRUNCATE TABLE schedules');
        for (const s of schedule) {
            await query(
                'INSERT INTO schedules (roll_no, name, raw_line, times) VALUES ($1, $2, $3, $4)',
                [s.rollNo, s.name, s.rawLine, s.times]
            );
        }
        await query('COMMIT');
    } catch (e) {
        await query('ROLLBACK');
        console.error("DB Error saveSchedule:", e);
    }
};

// --- Domains ---
export const getDomains = async (): Promise<DomainConfig[]> => {
    try {
        const res = await query('SELECT * FROM domains');
        return res.rows.map(row => ({
            name: row.name,
            password: row.password,
            meetLink: row.meet_link
        }));
    } catch (e) {
        console.error("DB Error getDomains:", e);
        return [];
    }
};

export const saveDomains = async (domains: DomainConfig[]) => {
    try {
        await query('BEGIN');
        // We don't truncate names/passwords usually, but logic matches JSON replacement
        for (const d of domains) {
            await query(
                `INSERT INTO domains (name, password, meet_link) 
                 VALUES ($1, $2, $3)
                 ON CONFLICT (name) DO UPDATE 
                 SET password = EXCLUDED.password, meet_link = EXCLUDED.meet_link`,
                [d.name, d.password, d.meetLink]
            );
        }
        await query('COMMIT');
    } catch (e) {
        await query('ROLLBACK');
        console.error("DB Error saveDomains:", e);
    }
};

// --- Single Student Helper ---
export const getStudentByRollNo = async (rollNo: string): Promise<(Student & { schedule?: ScheduleItem }) | null> => {
    try {
        const studentRes = await query('SELECT * FROM students WHERE roll_no = $1', [rollNo]);
        const scheduleRes = await query('SELECT * FROM schedules WHERE roll_no = $1', [rollNo]);

        if (studentRes.rowCount === 0) return null;

        const s = studentRes.rows[0];
        const sc = scheduleRes.rows[0];

        return {
            id: s.id.toString(),
            name: s.name,
            rollNo: s.roll_no,
            email: s.email,
            domains: s.domains || [],
            schedule: sc ? {
                rollNo: sc.roll_no,
                name: sc.name,
                rawLine: sc.raw_line,
                times: sc.times || []
            } : undefined
        };
    } catch (e) {
        console.error("DB Error getStudentByRollNo:", e);
        return null;
    }
};
