"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TransactionList } from "@/components/TransactionList";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { CategoryBadge } from "@/components/CategoryBadge";
import { useTransactions } from "@/hooks/useTransactions";
import { useSettings } from "@/hooks/useSettings";
import { CATEGORIES } from "@/lib/categories";
import { Transaction, TransactionFormData, CategoryId } from "@/types";
import { toast } from "sonner";

export default function TransactionsPage() {
  const { transactions, loading, add, update, remove } = useTransactions();
  const { settings } = useSettings();
  const [editTxn, setEditTxn] = useState<Transaction | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | "all">("all");

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        if (typeFilter !== "all" && t.type !== typeFilter) return false;
        if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            t.description.toLowerCase().includes(q) ||
            CATEGORIES[t.category]?.label.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, search, typeFilter, categoryFilter]);

  const hasFilters = search || typeFilter !== "all" || categoryFilter !== "all";

  function clearFilters() {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("all");
  }

  function handleEdit(id: string, data: TransactionFormData) {
    update(id, data);
    setEditTxn(null);
    toast.success("Transaction updated");
  }

  function handleDelete(id: string) {
    remove(id);
    toast.success("Transaction deleted");
  }

  return (
    <div className="p-5 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {transactions.length} total transactions
          </p>
        </div>
        <AddTransactionDialog
          onAdd={add}
          editTransaction={editTxn}
          onEdit={handleEdit}
          onEditClose={() => setEditTxn(null)}
        />
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}
            >
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={categoryFilter}
              onValueChange={(v) => setCategoryFilter(v as CategoryId | "all")}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.values(CATEGORIES).map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-1.5 text-muted-foreground shrink-0"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {hasFilters && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-muted-foreground">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
              {typeFilter !== "all" && (
                <Badge variant="secondary" className="text-xs capitalize">
                  {typeFilter}
                </Badge>
              )}
              {categoryFilter !== "all" && (
                <CategoryBadge category={categoryFilter} size="sm" />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction list */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <TransactionList
            transactions={filtered}
            loading={loading}
            currency={settings.currency}
            onEdit={setEditTxn}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {editTxn && (
        <AddTransactionDialog
          onAdd={add}
          editTransaction={editTxn}
          onEdit={handleEdit}
          onEditClose={() => setEditTxn(null)}
        />
      )}
    </div>
  );
}
