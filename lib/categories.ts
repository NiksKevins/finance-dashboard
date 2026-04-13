import { Category, CategoryId } from "@/types";

export const CATEGORIES: Record<CategoryId, Category> = {
  food: {
    id: "food",
    label: "Food & Dining",
    color: "#f97316",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-600 dark:text-orange-400",
    icon: "UtensilsCrossed",
    type: "expense",
  },
  transport: {
    id: "transport",
    label: "Transport",
    color: "#3b82f6",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-600 dark:text-blue-400",
    icon: "Car",
    type: "expense",
  },
  rent: {
    id: "rent",
    label: "Rent & Housing",
    color: "#8b5cf6",
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
    textColor: "text-violet-600 dark:text-violet-400",
    icon: "Home",
    type: "expense",
  },
  entertainment: {
    id: "entertainment",
    label: "Entertainment",
    color: "#ec4899",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    textColor: "text-pink-600 dark:text-pink-400",
    icon: "Tv",
    type: "expense",
  },
  shopping: {
    id: "shopping",
    label: "Shopping",
    color: "#f59e0b",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    textColor: "text-amber-600 dark:text-amber-400",
    icon: "ShoppingBag",
    type: "expense",
  },
  health: {
    id: "health",
    label: "Health & Fitness",
    color: "#10b981",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    textColor: "text-emerald-600 dark:text-emerald-400",
    icon: "Heart",
    type: "expense",
  },
  utilities: {
    id: "utilities",
    label: "Utilities",
    color: "#6366f1",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    textColor: "text-indigo-600 dark:text-indigo-400",
    icon: "Zap",
    type: "expense",
  },
  salary: {
    id: "salary",
    label: "Salary",
    color: "#22c55e",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-600 dark:text-green-400",
    icon: "Banknote",
    type: "income",
  },
  freelance: {
    id: "freelance",
    label: "Freelance",
    color: "#14b8a6",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
    textColor: "text-teal-600 dark:text-teal-400",
    icon: "Laptop",
    type: "income",
  },
  investment: {
    id: "investment",
    label: "Investment",
    color: "#84cc16",
    bgColor: "bg-lime-100 dark:bg-lime-900/30",
    textColor: "text-lime-600 dark:text-lime-400",
    icon: "TrendingUp",
    type: "income",
  },
  other: {
    id: "other",
    label: "Other",
    color: "#94a3b8",
    bgColor: "bg-slate-100 dark:bg-slate-900/30",
    textColor: "text-slate-600 dark:text-slate-400",
    icon: "MoreHorizontal",
    type: "both",
  },
};

export const EXPENSE_CATEGORIES = Object.values(CATEGORIES).filter(
  (c) => c.type === "expense" || c.type === "both"
);

export const INCOME_CATEGORIES = Object.values(CATEGORIES).filter(
  (c) => c.type === "income" || c.type === "both"
);

export function getCategoryById(id: CategoryId): Category {
  return CATEGORIES[id] ?? CATEGORIES.other;
}
