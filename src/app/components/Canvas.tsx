import React from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import styles from './Canvas.module.css';
import { getToolsByCategory, getToolById } from '../../modules/tools/registry';

interface CanvasProps {
  activeCategoryId: string | null;
  activeToolId: string | null;
  onSelectTool: (id: string | null) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ activeCategoryId, activeToolId, onSelectTool }) => {
  const tools = activeCategoryId ? getToolsByCategory(activeCategoryId) : [];
  const activeTool = activeToolId ? getToolById(activeToolId) : null;

  return (
    <main className={`glass-panel ${styles.canvas}`}>
      {/* Top Glow Effect */}
      
      <header className={styles.header}>
        {activeTool ? (
           <button onClick={() => onSelectTool(null)} className={styles.backButton}>
             <ArrowLeft size={20} />
             <span>Back</span>
           </button>
        ) : null}
        
        <h1 className="glow-text">
          {activeTool ? activeTool.name : 'Alchemy AI Toolbox'}
        </h1>
        
        <div className={styles.userProfile}>
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=AlchemyUser" 
            alt="User" 
            className={styles.avatar} 
          />
        </div>
      </header>

      <div className={styles.content}>
        {/* Grid Background Effect */}
        <div className={styles.gridBackground}></div>

        {/* 1. Active Tool View */}
        {activeTool ? (
          <div className={styles.toolContainer}>
            <activeTool.component />
          </div>
        ) : activeCategoryId ? (
          /* 2. Category View (List of Tools) */
          <div className={styles.toolGrid}>
            {tools.length > 0 ? (
              tools.map((tool) => (
                <button
                  key={tool.id}
                  className={`glass-panel ${styles.toolCard}`}
                  onClick={() => onSelectTool(tool.id)}
                >
                  <div className={styles.toolIconWrapper}>
                    <tool.icon size={32} />
                  </div>
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>
                </button>
              ))
            ) : (
              <div className={styles.emptyCategory}>
                <p>No tools in this category yet.</p>
              </div>
            )}
          </div>
        ) : (
          /* 3. Empty Dashboard State */
          <div className={styles.emptyState}>
            <div className={`${styles.badge} glow-border`}>
              Alchemy AI Toolbox
            </div>
            <h2 className={styles.emptyTitle}>
              No tools yet. Create <br /> categories and then add <br /> tools.
            </h2>
            <button className={`${styles.addButton} glow-border`}>
              <Plus size={24} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
};
