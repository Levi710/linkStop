const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const uploadData = async () => {
    try {
        console.log("Connecting to DB...");
        const client = await pool.connect();

        // 1. Create Tables
        console.log("Creating tables...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS domains (
                name VARCHAR(255) PRIMARY KEY,
                password VARCHAR(255) NOT NULL,
                meet_link TEXT
            );
            
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                roll_no VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255),
                domains TEXT[]
            );
            
            CREATE TABLE IF NOT EXISTS schedules (
                roll_no VARCHAR(50) PRIMARY KEY REFERENCES students(roll_no) ON DELETE CASCADE,
                name VARCHAR(255),
                raw_line TEXT,
                times TEXT[]
            );
        `);

        // 2. Upload Domains
        console.log("Uploading Domains...");
        const domainsPath = path.join(__dirname, '../src/data/domains.json');
        const domains = JSON.parse(fs.readFileSync(domainsPath, 'utf8'));

        for (const d of domains) {
            await client.query(`
                INSERT INTO domains (name, password, meet_link)
                VALUES ($1, $2, $3)
                ON CONFLICT (name) DO UPDATE 
                SET password = EXCLUDED.password, meet_link = EXCLUDED.meet_link;
            `, [d.name, d.password, d.meetLink]);
        }

        // 3. Upload Students
        console.log("Uploading Students...");
        const studentsPath = path.join(__dirname, '../src/data/students.json');
        const students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

        for (const s of students) {
            await client.query(`
                INSERT INTO students (name, roll_no, email, domains)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (roll_no) DO UPDATE 
                SET name = EXCLUDED.name, email = EXCLUDED.email, domains = EXCLUDED.domains;
            `, [s.name, s.rollNo, s.email, s.domains]);
        }

        // 4. Upload Schedule
        console.log("Uploading Schedule...");
        const schedulePath = path.join(__dirname, '../src/data/schedule.json');
        const schedule = JSON.parse(fs.readFileSync(schedulePath, 'utf8'));

        for (const sc of schedule) {
            await client.query(`
                INSERT INTO schedules (roll_no, name, raw_line, times)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (roll_no) DO UPDATE 
                SET times = EXCLUDED.times;
            `, [sc.rollNo, sc.name, sc.rawLine, sc.times]);
        }

        console.log("✅ Migration Complete!");
        client.release();
        process.exit(0);

    } catch (e) {
        console.error("❌ Error:", e);
        process.exit(1);
    }
};

uploadData();
