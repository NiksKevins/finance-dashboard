"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CategorySummary, Currency } from "@/types";
import { getCategoryById } from "@/lib/categories";
import { formatCurrency } from "@/lib/data";

interface CategoryDonutChartProps {
  data: CategorySummary[];
  currency?: Currency;
}

function CustomTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: CategorySummary }[];
  currency: Currency;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  const cat = getCategoryById(item.category);
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg p-3 text-xs space-y-1">
      <p className="font-semibold text-foreground">{cat.label}</p>
      <p className="text-muted-foreground">
        {formatCurrency(item.total, currency)}
        <span className="ml-2 text-foreground font-medium">
          ({item.percentage.toFixed(1)}%)
        </span>
      </p>
    </div>
  );
}

export function CategoryDonutChart({
  data,
  currency = "USD",
}: CategoryDonutChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
        No expense data
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <div className="flex-shrink-0">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={2}
              dataKey="total"
              strokeWidth={0}
            >
              {data.map((entry) => {
                const cat = getCategoryById(entry.category);
                return <Cell key={entry.category} fill={cat.color} />;
              })}
            </Pie>
            <Tooltip content={<CustomTooltip currency={currency} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        {data.slice(0, 6).map((item) => {
          const cat = getCategoryById(item.category);
          return (
            <div key={item.category} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: cat.color }}
              />
              <span className="text-xs text-muted-foreground truncate flex-1">
                {cat.label}
              </span>
              <span className="text-xs font-medium text-foreground tabular-nums">
                {item.percentage.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
