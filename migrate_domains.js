const fs = require('fs');
const path = require('path');

const studentsPath = path.join(__dirname, 'src/data/students.json');
const domainsPath = path.join(__dirname, 'src/data/domains.json');

// --- Migrate Students ---
try {
    const studentsRaw = fs.readFileSync(studentsPath, 'utf8');
    const students = JSON.parse(studentsRaw);

    let updatedCount = 0;

    const updatedStudents = students.map(student => {
        const domains = new Set(student.domains);
        let changed = false;

        if (domains.has("Photography")) {
            domains.delete("Photography");
            domains.add("Video & Photo Editing");
            changed = true;
        }
        if (domains.has("Videography")) {
            domains.delete("Videography");
            domains.add("Video & Photo Editing");
            changed = true;
        }

        if (changed) {
            updatedCount++;
            return { ...student, domains: Array.from(domains) };
        }
        return student;
    });

    fs.writeFileSync(studentsPath, JSON.stringify(updatedStudents, null, 2));
    console.log(`Updated ${updatedCount} students.`);

} catch (e) {
    console.error("Error updating students:", e);
}

// --- Migrate Domains ---
try {
    const domainsRaw = fs.readFileSync(domainsPath, 'utf8');
    const domains = JSON.parse(domainsRaw);

    const filteredDomains = domains.filter(d =>
        d.name !== "Photography" && d.name !== "Videography"
    );

    if (filteredDomains.length !== domains.length) {
        fs.writeFileSync(domainsPath, JSON.stringify(filteredDomains, null, 2));
        console.log("Updated domains.json: Removed Photography and Videography.");
    } else {
        console.log("domains.json already updated.");
    }

} catch (e) {
    console.error("Error updating domains:", e);
}
