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
    domains TEXT[] -- Array of strings
);

CREATE TABLE IF NOT EXISTS schedules (
    roll_no VARCHAR(50) PRIMARY KEY REFERENCES students(roll_no) ON DELETE CASCADE,
    name VARCHAR(255),
    raw_line TEXT,
    times TEXT[]
);
