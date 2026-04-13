"use client";

import { useState, useEffect, useCallback } from "react";
import { getSettings, saveSettings } from "@/lib/data";
import { AppSettings, Currency } from "@/types";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>({
    currency: "USD",
    theme: "system",
  });

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const updateCurrency = useCallback((currency: Currency) => {
    setSettings((prev) => {
      const updated = { ...prev, currency };
      saveSettings(updated);
      return updated;
    });
  }, []);

  return { settings, updateCurrency };
}
