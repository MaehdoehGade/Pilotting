import {
  Coffee,
  Home,
  Landmark,
  ShoppingBag,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";

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
  style,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
  style?: CSSProperties;
}) {
  const Cmp = registry[name] ?? Home;
  return <Cmp className={className} strokeWidth={strokeWidth} style={style} />;
}
