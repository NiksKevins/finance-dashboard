# Finflow — Personal Finance Dashboard

A production-ready personal finance dashboard built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, and Recharts.

## Features

- **Overview Dashboard** — Total balance, income, expenses, and net savings for the current month with trend indicators vs. the previous month
- **Transaction Management** — Add, edit, and delete transactions with inline form validation. Transactions grouped by date (Today / Yesterday / This Week / older)
- **Categories** — 11 predefined categories (Food, Transport, Rent, Entertainment, Shopping, Health, Utilities, Salary, Freelance, Investment, Other), each with a color and icon
- **Search & Filter** — Filter transactions by type (income/expense), category, or full-text search
- **Charts & Analytics**
  - Monthly income/expense bar chart (6-month trend)
  - Category donut chart with percentage breakdown
  - Daily spending area chart per month
  - Category progress bars with amounts
- **Settings** — Toggle light/dark/system theme; switch display currency (USD / EUR / GBP); clear all data
- **Responsive** — Sidebar layout on desktop, bottom nav on mobile
- **Toast Notifications** — Sonner toasts for every create/update/delete action
- **Loading Skeletons** — Shown while data hydrates from localStorage
- **Empty States** — Illustrated empty state when no transactions exist

## Data Storage

All data is persisted in the browser's `localStorage` under two keys:

| Key | Content |
|-----|---------|
| `finance_transactions` | Array of `Transaction` objects |
| `finance_settings` | `{ currency, theme }` |

On first load, seed data is generated so the dashboard looks populated out of the box.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.tsx              # Overview (dashboard) page
  transactions/         # Transaction list + filter page
  analytics/            # Charts & monthly analytics page
  settings/             # Theme, currency, data management
  layout.tsx            # Root layout — Sidebar, MobileNav, ThemeProvider, Toaster

components/
  DashboardCard.tsx     # Stat card with trend indicator
  TransactionList.tsx   # Grouped transaction list with edit/delete
  TransactionForm.tsx   # Add/edit form with inline validation
  AddTransactionDialog.tsx  # Dialog wrapper for TransactionForm
  CategoryBadge.tsx     # Pill badge with category icon + label
  CategoryIcon.tsx      # Icon resolver for category icon names
  Sidebar.tsx           # Desktop sidebar navigation
  MobileNav.tsx         # Mobile bottom nav
  ThemeProvider.tsx     # next-themes wrapper
  charts/
    MonthlyBarChart.tsx   # Recharts bar chart
    CategoryDonutChart.tsx # Recharts pie/donut chart
    DailyLineChart.tsx    # Recharts area chart

hooks/
  useTransactions.ts    # CRUD state over localStorage
  useSettings.ts        # Currency + theme settings state

lib/
  data.ts               # localStorage read/write, seed data, currency formatting
  analytics.ts          # Pure functions: summaries, category breakdowns, daily spending
  categories.ts         # Category definitions (color, icon, label)

types/
  index.ts              # Transaction, Category, MonthlySummary, etc.
```

## Adding a Backend

The data layer is intentionally isolated in `lib/data.ts`. To connect a backend:

1. Replace `getTransactions`, `addTransaction`, `updateTransaction`, `deleteTransaction` in `lib/data.ts` with `fetch` calls to your API.
2. The hooks (`useTransactions`, `useSettings`) will automatically pick up the new implementations.
3. For server-side rendering, convert `app/page.tsx` and sibling pages back to async Server Components and pass data as props — the analytics functions in `lib/analytics.ts` are pure and work server-side too.

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 16 | App Router, file-based routing, React Server Components |
| TypeScript | Type safety across the entire codebase |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui (base-ui) | Accessible UI primitives |
| Recharts | Charts |
| date-fns | Date manipulation |
| next-themes | Dark/light/system theme |
| Sonner | Toast notifications |
| Lucide React | Icons |
