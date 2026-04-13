"use client";

import { useMemo } from "react";
import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  parseISO,
} from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { Transaction, Currency } from "@/types";
import { CategoryBadge } from "./CategoryBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/data";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
  loading?: boolean;
  currency?: Currency;
  onEdit?: (t: Transaction) => void;
  onDelete?: (id: string) => void;
}

function getGroupLabel(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date)) return "This Week";
  return format(date, "MMMM d, yyyy");
}

function groupTransactions(
  transactions: Transaction[]
): [string, Transaction[]][] {
  const map = new Map<string, Transaction[]>();
  for (const t of transactions) {
    const label = getGroupLabel(t.date);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(t);
  }
  return Array.from(map.entries());
}

export function TransactionList({
  transactions,
  loading,
  currency = "USD",
  onEdit,
  onDelete,
}: TransactionListProps) {
  const grouped = useMemo(
    () => groupTransactions(transactions),
    [transactions]
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, gi) => (
          <div key={gi}>
            <Skeleton className="h-3.5 w-20 mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/40"
                >
                  <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <span className="text-2xl">💸</span>
        </div>
        <p className="font-semibold text-foreground mb-1">No transactions yet</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Add your first transaction to start tracking your finances.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {grouped.map(([label, txns]) => (
        <div key={label}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-1">
            {label}
          </p>
          <div className="space-y-1.5">
            {txns.map((t) => (
              <TransactionRow
                key={t.id}
                transaction={t}
                currency={currency}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TransactionRow({
  transaction: t,
  currency,
  onEdit,
  onDelete,
}: {
  transaction: Transaction;
  currency: Currency;
  onEdit?: (t: Transaction) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors duration-150">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-foreground truncate">
            {t.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CategoryBadge category={t.category} size="sm" />
          <span className="text-xs text-muted-foreground">
            {format(parseISO(t.date), "MMM d")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            t.type === "income"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-foreground"
          )}
        >
          {t.type === "income" ? "+" : "-"}
          {formatCurrency(t.amount, currency)}
        </span>

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(t)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-red-500"
                onClick={() => onDelete(t.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
