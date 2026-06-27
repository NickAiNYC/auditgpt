import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClaimStatus } from "@/lib/schema/claim-record";

interface WebsiteRisk {
  claim: string;
  status: ClaimStatus;
  rewrite: string;
}

interface ClaimRiskTableProps {
  risks: WebsiteRisk[];
}

export function ClaimRiskTable({ risks }: ClaimRiskTableProps) {
  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case "overstated":
      case "unsupported":
      case "ai_distorted":
        return <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/10 uppercase tracking-widest text-[10px]">{status.replace('_', ' ')}</Badge>;
      case "needs_review":
      case "weakly_supported":
      case "expired":
        return <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10 uppercase tracking-widest text-[10px]">{status.replace('_', ' ')}</Badge>;
      case "verified":
        return <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 uppercase tracking-widest text-[10px]">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border border-white/10 bg-white/[0.01] overflow-hidden">
      <Table>
        <TableHeader className="bg-white/[0.02]">
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground w-1/3">Original Claim</TableHead>
            <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground w-[120px]">Status</TableHead>
            <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Safer Rewrite</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {risks.map((r, i) => (
            <TableRow key={i} className="border-white/10 hover:bg-white/[0.02] transition-colors">
              <TableCell className="font-medium text-sm text-muted-foreground line-through decoration-red-500/50">"{r.claim}"</TableCell>
              <TableCell>{getStatusBadge(r.status)}</TableCell>
              <TableCell className="text-sm font-medium text-foreground">"{r.rewrite}"</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
