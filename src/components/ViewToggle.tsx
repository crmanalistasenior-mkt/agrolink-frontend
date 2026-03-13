import { LayoutDashboard, List } from 'lucide-react';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export const ViewToggle = ({ mode, onChange }: ViewToggleProps) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-1 flex gap-1">
      <button
        onClick={() => onChange('grid')}
        className={`p-2 rounded-md transition-all flex items-center justify-center ${
          mode === 'grid' 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : 'text-white/30 hover:text-white/60'
        }`}
        aria-label="Grid view"
      >
        <LayoutDashboard size={16} />
      </button>
      <button
        onClick={() => onChange('list')}
        className={`p-2 rounded-md transition-all flex items-center justify-center ${
          mode === 'list' 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : 'text-white/30 hover:text-white/60'
        }`}
        aria-label="List view"
      >
        <List size={16} />
      </button>
    </div>
  );
};
