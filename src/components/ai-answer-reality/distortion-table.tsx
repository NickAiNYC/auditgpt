import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Distortion {
  aiSaid: string;
  reality: string;
  fix: string;
}

interface DistortionTableProps {
  distortions: Distortion[];
}

export function DistortionTable({ distortions }: DistortionTableProps) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.01] overflow-hidden">
      <Table>
        <TableHeader className="bg-white/[0.02]">
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground w-1/3">What AI Said</TableHead>
            <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground w-1/3">The Reality</TableHead>
            <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground w-1/3">Required Fix</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {distortions.map((d, i) => (
            <TableRow key={i} className="border-white/10 hover:bg-white/[0.02] transition-colors">
              <TableCell className="font-medium text-sm text-red-400">"{d.aiSaid}"</TableCell>
              <TableCell className="text-sm text-muted-foreground">{d.reality}</TableCell>
              <TableCell className="text-sm text-emerald-400">{d.fix}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
