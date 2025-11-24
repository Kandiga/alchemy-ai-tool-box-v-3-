import React from 'react';
import { Plus } from 'lucide-react';
import type { Category } from '../../modules/categories/store';
import styles from './Sidebar.module.css';

interface SidebarProps {
    categories: Category[];
    activeCategoryId: string | null;
    onSelectCategory: (id: string) => void;
    onAddCategory: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    categories,
    activeCategoryId,
    onSelectCategory,
    onAddCategory,
}) => {
    return (
        <aside className={`glass-panel ${styles.sidebar}`}>
            <div className={styles.header}>
                <h2 className="glow-text">CATEGORIES</h2>
            </div>

            <div className={styles.categoryList}>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`${styles.categoryItem} ${activeCategoryId === category.id ? styles.active : ''
                            }`}
                        onClick={() => onSelectCategory(category.id)}
                    >
                        <category.icon size={20} className={styles.icon} />
                        <span>{category.name}</span>
                    </button>
                ))}
            </div>

            <div className={styles.footer}>
                <button className={`${styles.addButton} glow-border`} onClick={onAddCategory}>
                    <Plus size={18} />
                    <span>Create new category</span>
                </button>
            </div>
        </aside>
    );
};
