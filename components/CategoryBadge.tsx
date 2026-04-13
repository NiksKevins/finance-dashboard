import { cn } from "@/lib/utils";
import { CategoryId } from "@/types";
import { getCategoryById } from "@/lib/categories";
import { CategoryIcon } from "./CategoryIcon";

interface CategoryBadgeProps {
  category: CategoryId;
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function CategoryBadge({
  category,
  showLabel = true,
  size = "md",
  className,
}: CategoryBadgeProps) {
  const cat = getCategoryById(category);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        cat.bgColor,
        cat.textColor,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      <CategoryIcon
        iconName={cat.icon}
        className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"}
      />
      {showLabel && cat.label}
    </span>
  );
}
