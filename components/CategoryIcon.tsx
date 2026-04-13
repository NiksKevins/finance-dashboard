import {
  UtensilsCrossed,
  Car,
  Home,
  Tv,
  ShoppingBag,
  Heart,
  Zap,
  Banknote,
  Laptop,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  UtensilsCrossed,
  Car,
  Home,
  Tv,
  ShoppingBag,
  Heart,
  Zap,
  Banknote,
  Laptop,
  TrendingUp,
  MoreHorizontal,
};

interface CategoryIconProps {
  iconName: string;
  className?: string;
}

export function CategoryIcon({ iconName, className }: CategoryIconProps) {
  const Icon = ICONS[iconName] ?? MoreHorizontal;
  return <Icon className={className} />;
}
