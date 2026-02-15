import { NextResponse } from "next/server";
import { getDomains } from "@/lib/api";

const SUPER_ADMIN_PASS = "admin123";

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // Check Super Admin
        if (password === SUPER_ADMIN_PASS) {
            return NextResponse.json({ success: true, role: "super_admin" });
        }

        // Check Domain Admins
        const domains = await getDomains();
        const matchedDomain = domains.find(d => d.password === password);

        if (matchedDomain) {
            return NextResponse.json({
                success: true,
                role: "domain_admin",
                domainName: matchedDomain.name
            });
        }

        return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });

    } catch (error) {
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}
