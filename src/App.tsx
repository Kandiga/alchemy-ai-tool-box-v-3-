import { Sidebar } from './app/components/Sidebar';
import { Canvas } from './app/components/Canvas';
import { useCategories } from './modules/categories/store';
import './app/styles/design-system.css';

function App() {
  const {
    categories,
    activeCategoryId,
    setActiveCategoryId,
    addCategory,
    activeToolId,
    setActiveToolId
  } = useCategories();

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      padding: '24px',
      gap: '24px',
      boxSizing: 'border-box'
    }}>
      <Sidebar
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
        onAddCategory={() => addCategory('New Category')}
      />
      <Canvas
        activeCategoryId={activeCategoryId}
        activeToolId={activeToolId}
        onSelectTool={setActiveToolId}
      />
    </div>
  );
}

export default App;
