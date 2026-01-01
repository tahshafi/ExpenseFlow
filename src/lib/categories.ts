import { CategoryInfo, ExpenseCategory } from '@/types';

export const categories: CategoryInfo[] = [
  { id: 'food', name: 'Food & Dining', icon: 'UtensilsCrossed', color: 'hsl(38, 92%, 50%)' },
  { id: 'transport', name: 'Transportation', icon: 'Car', color: 'hsl(238, 84%, 67%)' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Gamepad2', color: 'hsl(280, 84%, 60%)' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: 'hsl(340, 82%, 52%)' },
  { id: 'utilities', name: 'Utilities', icon: 'Zap', color: 'hsl(200, 98%, 39%)' },
  { id: 'healthcare', name: 'Healthcare', icon: 'Heart', color: 'hsl(0, 84%, 60%)' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', color: 'hsl(160, 84%, 39%)' },
  { id: 'travel', name: 'Travel', icon: 'Plane', color: 'hsl(180, 70%, 45%)' },
  { id: 'rent', name: 'Rent & Housing', icon: 'Home', color: 'hsl(25, 95%, 53%)' },
  { id: 'subscriptions', name: 'Subscriptions', icon: 'CreditCard', color: 'hsl(260, 67%, 55%)' },
  { id: 'other', name: 'Other', icon: 'MoreHorizontal', color: 'hsl(220, 9%, 46%)' },
];

export const getCategoryInfo = (categoryId: ExpenseCategory): CategoryInfo => {
  return categories.find(c => c.id === categoryId) || categories[categories.length - 1];
};

export const getCategoryColor = (categoryId: ExpenseCategory): string => {
  return getCategoryInfo(categoryId).color;
};
