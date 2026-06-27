import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface QueryResult {
  query: string;
  aiResult: string;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface AIQueryResultTableProps {
  results: QueryResult[];
}

export function AIQueryResultTable({ results }: AIQueryResultTableProps) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.01] overflow-hidden">
      <Table>
        <TableHeader className="bg-white/[0.02]">
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">User Query</TableHead>
            <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">AI Output Summary</TableHead>
            <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground w-[100px]">Risk</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((r, i) => (
            <TableRow key={i} className="border-white/10 hover:bg-white/[0.02] transition-colors">
              <TableCell className="font-medium text-sm">"{r.query}"</TableCell>
              <TableCell className="text-sm text-muted-foreground">{r.aiResult}</TableCell>
              <TableCell>
                <Badge variant="outline" className={
                  r.risk === 'High' || r.risk === 'Critical' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                  r.risk === 'Medium' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' :
                  'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                }>
                  {r.risk}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
