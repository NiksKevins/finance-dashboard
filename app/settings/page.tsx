"use client";

import { useState } from "react";
import { Moon, Sun, Monitor, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/useSettings";
import { Currency } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: "USD", label: "US Dollar", symbol: "$" },
  { value: "EUR", label: "Euro", symbol: "€" },
  { value: "GBP", label: "British Pound", symbol: "£" },
];

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export default function SettingsPage() {
  const { settings, updateCurrency } = useSettings();
  const { theme, setTheme } = useTheme();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleClearData() {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }
    localStorage.removeItem("finance_transactions");
    toast.success("All data cleared. Refresh to see seed data.");
    setShowConfirm(false);
  }

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Customize your Finflow experience
        </p>
      </div>

      {/* Appearance */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-150 text-sm font-medium",
                    theme === value
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                      : "border-border hover:border-border/80 hover:bg-muted/50 text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Currency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Display Currency
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Used for all amounts across the dashboard
              </p>
            </div>
            <Select
              value={settings.currency}
              onValueChange={(v) => {
                updateCurrency(v as Currency);
                toast.success("Currency updated");
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.symbol} — {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-0.5">
              Storage
            </p>
            <p className="text-xs text-muted-foreground">
              All transaction data is stored in your browser&apos;s localStorage.
              No data is sent to any server.
            </p>
          </div>

          <Separator />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Clear All Data</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permanently delete all transactions. This cannot be undone.
              </p>
            </div>
            <Button
              variant={showConfirm ? "destructive" : "outline"}
              size="sm"
              onClick={handleClearData}
              className="shrink-0 gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {showConfirm ? "Confirm Delete" : "Clear Data"}
            </Button>
          </div>
          {showConfirm && (
            <p className="text-xs text-red-500 font-medium">
              Click again to confirm — this will delete all your data.
            </p>
          )}
        </CardContent>
      </Card>

      {/* About */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Finflow</span> — a
            personal finance dashboard built with Next.js, TypeScript, Tailwind
            CSS, and shadcn/ui.
          </p>
          <p>
            Data is persisted in your browser&apos;s localStorage. To add a backend,
            replace the functions in <code className="text-xs bg-muted px-1.5 py-0.5 rounded">lib/data.ts</code> with
            API calls.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
