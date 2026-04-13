"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionForm } from "./TransactionForm";
import { Transaction, TransactionFormData } from "@/types";
import { toast } from "sonner";

interface AddTransactionDialogProps {
  onAdd: (data: TransactionFormData) => void;
  editTransaction?: Transaction | null;
  onEdit?: (id: string, data: TransactionFormData) => void;
  onEditClose?: () => void;
}

export function AddTransactionDialog({
  onAdd,
  editTransaction,
  onEdit,
  onEditClose,
}: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Controlled by parent when editing
  const isEditing = !!editTransaction;

  function handleSubmit(data: TransactionFormData) {
    setLoading(true);
    try {
      if (isEditing && onEdit && editTransaction) {
        onEdit(editTransaction.id, data);
        toast.success("Transaction updated");
        onEditClose?.();
      } else {
        onAdd(data);
        toast.success("Transaction added");
        setOpen(false);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    if (isEditing) {
      onEditClose?.();
    } else {
      setOpen(false);
    }
  }

  if (isEditing) {
    return (
      <Dialog open={true} onOpenChange={(v) => !v && onEditClose?.()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            transaction={editTransaction}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button size="sm" className="gap-1.5" />}
      >
        <Plus className="h-4 w-4" />
        Add Transaction
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
        </DialogHeader>
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}
