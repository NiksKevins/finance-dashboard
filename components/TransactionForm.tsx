"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Transaction, TransactionFormData, TransactionType, CategoryId } from "@/types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/categories";
import { CategoryIcon } from "./CategoryIcon";
import { cn } from "@/lib/utils";

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const EMPTY_FORM: TransactionFormData = {
  amount: "",
  category: "food",
  date: format(new Date(), "yyyy-MM-dd"),
  description: "",
  type: "expense",
};

export function TransactionForm({
  transaction,
  onSubmit,
  onCancel,
  loading,
}: TransactionFormProps) {
  const [form, setForm] = useState<TransactionFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<TransactionFormData>>({});

  useEffect(() => {
    if (transaction) {
      setForm({
        amount: transaction.amount.toString(),
        category: transaction.category,
        date: transaction.date,
        description: transaction.description,
        type: transaction.type,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [transaction]);

  const categories =
    form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function validate(): boolean {
    const errs: Partial<TransactionFormData> = {};
    const amount = parseFloat(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0) {
      errs.amount = "Enter a valid amount" as never;
    }
    if (!form.description.trim()) {
      errs.description = "Description is required" as never;
    }
    if (!form.date) {
      errs.date = "Date is required" as never;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  function setType(type: TransactionType) {
    const newCategories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setForm((prev) => ({
      ...prev,
      type,
      category: newCategories[0].id,
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type toggle */}
      <div>
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
          Type
        </Label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={cn(
              "py-2 px-4 rounded-md text-sm font-medium transition-all duration-150",
              form.type === "expense"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={cn(
              "py-2 px-4 rounded-md text-sm font-medium transition-all duration-150",
              form.type === "income"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Income
          </button>
        </div>
      </div>

      {/* Amount */}
      <div>
        <Label htmlFor="amount" className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
          Amount
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
            $
          </span>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
            className={cn("pl-7", errors.amount && "border-red-500 focus-visible:ring-red-500")}
          />
        </div>
        {errors.amount && (
          <p className="text-xs text-red-500 mt-1">{errors.amount as string}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
          Description
        </Label>
        <Input
          id="description"
          placeholder="What was this for?"
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          className={cn(errors.description && "border-red-500 focus-visible:ring-red-500")}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description as string}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
          Category
        </Label>
        <Select
          value={form.category}
          onValueChange={(v) => setForm((p) => ({ ...p, category: v as CategoryId }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                <div className="flex items-center gap-2">
                  <CategoryIcon iconName={cat.icon} className="h-3.5 w-3.5" />
                  {cat.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date */}
      <div>
        <Label htmlFor="date" className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
          Date
        </Label>
        <Input
          id="date"
          type="date"
          value={form.date}
          onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
          className={cn(errors.date && "border-red-500 focus-visible:ring-red-500")}
        />
        {errors.date && (
          <p className="text-xs text-red-500 mt-1">{errors.date as string}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? "Saving..." : transaction ? "Update" : "Add Transaction"}
        </Button>
      </div>
    </form>
  );
}
