import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { FileText, Image, Database, Mic } from 'lucide-react';
import { getToolsByCategory } from '../tools/registry';

export interface Category {
    id: string;
    name: string;
    icon: LucideIcon;
}

export const INITIAL_CATEGORIES: Category[] = [
    { id: 'text', name: 'Text Analysis', icon: FileText },
    { id: 'image', name: 'Image Generation', icon: Image },
    { id: 'data', name: 'Data Processing', icon: Database },
    { id: 'voice', name: 'Voice Synthesis', icon: Mic },
];

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [activeToolId, setActiveToolId] = useState<string | null>(null);

    const addCategory = (name: string) => {
        const newCategory: Category = {
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name,
            icon: Database, // Default icon
        };
        setCategories([...categories, newCategory]);
    };

    // Reset tool when category changes
    const handleSelectCategory = (id: string) => {
        setActiveCategoryId(id);
        setActiveToolId(null);
    };

    return {
        categories,
        activeCategoryId,
        activeToolId,
        activeTools: activeCategoryId ? getToolsByCategory(activeCategoryId) : [],
        setActiveCategoryId: handleSelectCategory,
        setActiveToolId,
        addCategory,
    };
}
