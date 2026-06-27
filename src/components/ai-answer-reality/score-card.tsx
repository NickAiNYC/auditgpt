import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  description: string;
  trend?: 'up' | 'down' | 'neutral';
  alertStatus?: 'critical' | 'warning' | 'healthy';
}

export function ScoreCard({ title, score, maxScore = 100, description, alertStatus = 'healthy' }: ScoreCardProps) {
  const getAlertColor = () => {
    switch (alertStatus) {
      case 'critical': return 'text-red-500';
      case 'warning': return 'text-amber-500';
      case 'healthy': return 'text-emerald-500';
      default: return 'text-foreground';
    }
  };

  return (
    <Card className="bg-white/[0.02] border-white/10 backdrop-blur-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest font-mono">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-serif ${getAlertColor()}`}>
            {score}
          </span>
          <span className="text-sm text-muted-foreground font-mono">/ {maxScore}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}
