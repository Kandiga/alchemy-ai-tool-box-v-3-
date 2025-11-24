import type { LucideIcon } from 'lucide-react';

export interface Tool {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    component: React.ComponentType;
    categoryId: string;
}
