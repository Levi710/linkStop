const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const verify = async () => {
    try {
        const rollNo = '2306249';
        console.log(`Checking for student with Roll No: ${rollNo}...`);
        const res = await pool.query('SELECT * FROM students WHERE roll_no = $1', [rollNo]);

        if (res.rowCount > 0) {
            console.log("✅ Student found:", res.rows[0]);
        } else {
            console.error("❌ Student NOT found in database.");
        }
    } catch (e) {
        console.error("❌ DB Connection Error:", e);
    } finally {
        await pool.end();
    }
};

verify();
