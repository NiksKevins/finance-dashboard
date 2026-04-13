"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/lib/data";
import { Transaction, TransactionFormData } from "@/types";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTransactions(getTransactions());
    setLoading(false);
  }, []);

  const add = useCallback((data: TransactionFormData) => {
    const t = addTransaction(data);
    setTransactions((prev) => [t, ...prev]);
    return t;
  }, []);

  const update = useCallback((id: string, data: TransactionFormData) => {
    const updated = updateTransaction(id, data);
    if (!updated) return null;
    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const remove = useCallback((id: string) => {
    const ok = deleteTransaction(id);
    if (ok) setTransactions((prev) => prev.filter((t) => t.id !== id));
    return ok;
  }, []);

  return { transactions, loading, add, update, remove };
}
