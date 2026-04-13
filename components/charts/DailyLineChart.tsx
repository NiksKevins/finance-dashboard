"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { DailySpending, Currency } from "@/types";
import { formatCurrency } from "@/lib/data";

interface DailyLineChartProps {
  data: DailySpending[];
  currency?: Currency;
}

function CustomTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean;
  payload?: { value: number; payload: DailySpending }[];
  currency: Currency;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg p-3 text-xs space-y-1">
      <p className="text-muted-foreground">
        {format(parseISO(item.date), "MMMM d")}
      </p>
      <p className="font-semibold text-foreground">
        {formatCurrency(item.amount, currency)}
      </p>
    </div>
  );
}

export function DailyLineChart({ data, currency = "USD" }: DailyLineChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), "d"),
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={formatted}>
        <defs>
          <linearGradient id="spendingGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`)}
          width={32}
        />
        <Tooltip content={<CustomTooltip currency={currency} />} />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#spendingGrad)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0, fill: "#6366f1" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
