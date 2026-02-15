import { NextResponse } from "next/server";
import { getDomains, saveDomains, DomainConfig } from "@/lib/api";

export async function GET() {
    const domains = await getDomains();
    // Return domains without passwords for security (though this is an admin route, best practice)
    // Actually, for this simple app, the client might need to verify password locally or we do it here.
    // For "Update Meet Link", we just need the link.
    const safeDomains = domains.map(d => ({ name: d.name, meetLink: d.meetLink }));
    return NextResponse.json(safeDomains);
}

export async function POST(request: Request) {
    // Used to update meet links
    const body = await request.json();
    const { name, meetLink } = body;

    const domains = await getDomains();
    const domainIndex = domains.findIndex(d => d.name === name);

    if (domainIndex === -1) {
        return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    domains[domainIndex].meetLink = meetLink;
    await saveDomains(domains);

    return NextResponse.json({ success: true });
}
