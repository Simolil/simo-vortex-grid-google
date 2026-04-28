import { Home, TrendingUp, Grid, Gamepad2, Layers } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const navItems = [
  { id: 'all', label: 'Home', icon: Home },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
];

const categories = [
  'Action', 'Sports', 'Skill', 'Racing', 'Casual', 'IO', 'Retro'
];

export function Sidebar({ activeCategory, onCategoryChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-neutral-950 border-r border-neutral-800 flex flex-col z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
          <Layers className="text-white w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black tracking-tighter text-white">VORTEX<span className="text-indigo-500">GRID</span></h1>
      </div>

      <nav className="flex-1 px-4 space-y-8 mt-4">
        <div>
          <h2 className="px-4 text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-4">Navigation</h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onCategoryChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                  activeCategory === item.id 
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20" 
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div>
           <h2 className="px-4 text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-4">Categories</h2>
           <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                  activeCategory === cat 
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20" 
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Grid className="w-4 h-4 opacity-50" />
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-6 border-t border-neutral-800">
        <div className="bg-neutral-900 rounded-2xl p-4 border border-white/5">
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Server Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-mono text-emerald-500">OPTIMIZED</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
