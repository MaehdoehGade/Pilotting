import {
  Coffee,
  Home,
  Landmark,
  ShoppingBag,
  Ticket,
  type LucideIcon,
} from "lucide-react";

const registry: Record<string, LucideIcon> = {
  Home,
  Landmark,
  Coffee,
  ShoppingBag,
  Ticket,
};

export function CategoryIcon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = registry[name] ?? Home;
  return <Cmp className={className} strokeWidth={strokeWidth} />;
}
