import { Metadata } from "next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import fs from "fs/promises";
import path from "path";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin | Scrutexity Leads",
};

interface Lead {
  websiteUrl: string;
  email: string;
  businessType: string;
  sourcePage: string;
  submittedAt: string;
  status: string;
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  // Simple environment key protection for MVP
  const ADMIN_KEY = process.env.ADMIN_KEY || "scrutexity-admin-123";
  if (searchParams.key !== ADMIN_KEY) {
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

        <div className="rounded-md border border-white/10 bg-white/[0.01] overflow-hidden">
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">URL (Target)</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Email (Contact)</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Segment</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Source</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Submitted At</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground font-mono text-sm">
                    No leads ingested yet.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead, idx) => (
                  <TableRow key={idx} className="border-white/10 hover:bg-white/[0.02] transition-colors">
                    <TableCell className="font-medium text-sm text-foreground">
                      <a href={lead.websiteUrl} target="_blank" rel="noreferrer" className="hover:text-accent hover:underline">
                        {lead.websiteUrl.replace(/^https?:\/\//, '')}
                      </a>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <a href={`mailto:${lead.email}`} className="hover:text-accent">{lead.email}</a>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-[10px] bg-white/[0.02] border-white/10">{lead.businessType}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono text-xs">
                      {lead.sourcePage}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono text-xs">
                      {new Date(lead.submittedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          lead.status === 'new' ? "border-amber-500/30 text-amber-400 bg-amber-500/10 uppercase tracking-widest text-[10px]" : 
                          "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 uppercase tracking-widest text-[10px]"
                        }
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

      </div>
    </div>
  );
}
