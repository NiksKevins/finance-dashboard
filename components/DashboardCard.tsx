import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconBg?: string;
  loading?: boolean;
  accent?: "green" | "red" | "blue" | "purple";
}

export function DashboardCard({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  icon,
  iconBg = "bg-slate-100 dark:bg-slate-800",
  loading,
  accent,
}: DashboardCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change !== undefined && change === 0;

  if (loading) {
    return (
      <Card className="border-0 shadow-sm bg-card">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "border-0 shadow-sm bg-card transition-all duration-200 hover:shadow-md",
        accent === "green" && "ring-1 ring-emerald-200 dark:ring-emerald-900/50",
        accent === "red" && "ring-1 ring-red-200 dark:ring-red-900/50",
        accent === "blue" && "ring-1 ring-blue-200 dark:ring-blue-900/50",
        accent === "purple" && "ring-1 ring-violet-200 dark:ring-violet-900/50"
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground truncate">
              {value}
            </p>
            {(change !== undefined || subtitle) && (
              <div className="flex items-center gap-1.5 mt-1.5">
                {change !== undefined && (
                  <>
                    {isPositive && (
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                    )}
                    {isNegative && (
                      <TrendingDown className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                    )}
                    {isNeutral && (
                      <Minus className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    )}
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isPositive && "text-emerald-600 dark:text-emerald-400",
                        isNegative && "text-red-600 dark:text-red-400",
                        isNeutral && "text-slate-500"
                      )}
                    >
                      {isPositive ? "+" : ""}
                      {change.toFixed(1)}%
                    </span>
                  </>
                )}
                {changeLabel && (
                  <span className="text-xs text-muted-foreground">
                    {changeLabel}
                  </span>
                )}
                {subtitle && !changeLabel && (
                  <span className="text-xs text-muted-foreground">{subtitle}</span>
                )}
              </div>
            )}
          </div>
          <div
            className={cn(
              "p-2.5 rounded-xl flex-shrink-0",
              iconBg
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
