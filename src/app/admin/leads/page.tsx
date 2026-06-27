import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import fs from "fs/promises";
import path from "path";
import { LeadTableClient } from "./LeadTableClient";

export const metadata: Metadata = {
  title: "Admin | Scrutexity Leads",
};

interface Lead {
  id?: string;
  websiteUrl: string;
  email: string;
  businessType: string;
  sourcePage: string;
  submittedAt: string;
  status: string;
  trigger_found?: string;
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  // Simple environment key protection for MVP
  const ADMIN_KEY = process.env.ADMIN_KEY;
  if (!ADMIN_KEY || searchParams.key !== ADMIN_KEY) {
    return (
      <div className="min-h-screen bg-black text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-mono text-red-500 mb-2">401 Unauthorized</h1>
          <p className="text-muted-foreground text-sm">Access denied. Invalid or missing environment key.</p>
        </div>
      </div>
    );
  }

  let leads: Lead[] = [];
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'leads.jsonl');
    
    // Check if file exists
    try {
      await fs.access(filePath);
      const fileContent = await fs.readFile(filePath, "utf-8");
      leads = fileContent
        .split("\n")
        .filter(line => line.trim() !== "")
        .map(line => JSON.parse(line))
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()); // Newest first
    } catch (e) {
      // File doesn't exist yet, leads array remains empty
      console.log("No leads file found at", filePath);
    }
  } catch (error) {
    console.error("Error reading leads file:", error);
  }

  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-accent/30 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h1 className="font-serif text-3xl mb-1">Diagnostic Ingestion Pipeline</h1>
            <p className="text-sm text-muted-foreground font-mono">
              Total Ingested Targets: {leads.length}
            </p>
          </div>
          <Badge variant="outline" className="border-accent/30 text-accent bg-accent/10">
            INTERNAL ADMIN
          </Badge>
        </header>

        <LeadTableClient initialLeads={leads} adminKey={ADMIN_KEY} />

      </div>
    </div>
  );
}
