import { 
  UtensilsCrossed, Car, Gamepad2, ShoppingBag, Zap, Heart, 
  GraduationCap, Plane, Home, CreditCard, MoreHorizontal, Circle,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed, Car, Gamepad2, ShoppingBag, Zap, Heart,
  GraduationCap, Plane, Home, CreditCard, MoreHorizontal, Circle,
};

interface DynamicIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export const DynamicIcon = ({ name, className, style }: DynamicIconProps) => {
  const Icon = iconMap[name] || Circle;
  return <Icon className={className} style={style} />;
};
