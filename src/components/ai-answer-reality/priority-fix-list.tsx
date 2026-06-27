import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface PriorityFixListProps {
  fixes: string[];
}

export function PriorityFixList({ fixes }: PriorityFixListProps) {
  return (
    <Card className="bg-white/[0.02] border-white/10 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest font-mono">
          Priority Fixes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {fixes.map((fix, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-accent/10 text-accent text-xs font-mono border border-accent/20 shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-foreground leading-relaxed">
                {fix}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
