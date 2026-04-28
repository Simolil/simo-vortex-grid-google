import { useState, useEffect, useMemo } from 'react';
import { Search, Zap, Trophy, Target, Globe, Coffee, Joystick, Gamepad2, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GameCard } from './components/GameCard';
import { cn } from './lib/utils';
import gamesData from './lib/games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { name: 'All', icon: Gamepad2 },
    { name: 'Action', icon: Zap },
    { name: 'Racing', icon: Trophy },
    { name: 'Skill', icon: Target },
    { name: 'Sports', icon: Compass },
    { name: 'IO', icon: Globe },
    { name: 'Casual', icon: Coffee },
    { name: 'Retro', icon: Joystick },
  ];

  // Stealth: Panic Button & Tab Masking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.location.href = 'https://classroom.google.com';
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "Google Docs";
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) link.href = "https://ssl.gstatic.com/docs/doclist/images/docs_2022q2_32dp.png";
      } else {
        document.title = "VortexGrid";
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) link.href = "/favicon.ico";
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const filteredGames = useMemo(() => {
    const baseFiltered = gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Re-apply Bento Pattern sizing to the filtered result to maintain layout consistency
    return baseFiltered.map((game, index) => {
      let size: 'standard' | 'large' | 'wide' = 'standard';
      
      // Specifically force the first game to be Large
      if (index === 0) {
        size = 'large';
      } else {
        // Subsequent pattern for other large items
        const patternIndex = Math.floor(index / 12);
        const positionInPattern = index % 12;
        const patternPos = patternIndex % 3;
        
        if (patternPos === 1 && positionInPattern === 5) size = 'large';
        if (patternPos === 2 && positionInPattern === 10) size = 'large';
      }
      
      return { ...game, size };
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#111111] text-white selection:bg-indigo-500/30 font-sans">
      <div className="max-w-[1600px] mx-auto px-6">
        
        {/* Slim Sticky Header Container */}
        <div className="sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md border-b border-white/5 mb-8">
          <header className="py-4 flex items-center gap-4 lg:gap-8">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-black tracking-tighter text-white italic shrink-0"
            >
              VORTEX
            </motion.h1>

            {/* Categories Bar - Now in Header */}
            <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1 min-w-0">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all whitespace-nowrap border shrink-0",
                      isActive 
                        ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                        : "bg-[#1a1a1a] text-neutral-400 border-white/5 hover:border-white/20"
                    )}
                  >
                    <Icon className={cn("w-3 h-3", isActive ? "text-black" : "text-neutral-500")} />
                    <span className="text-[10px] font-black uppercase tracking-wider">{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Compact Search */}
            <div className="relative flex items-center group bg-[#1a1a1a] rounded-full px-2 py-1 border border-white/5 focus-within:border-white/20 transition-all shrink-0 ml-auto">
              <Search className="w-3 h-3 text-neutral-500 group-focus-within:text-white" />
              <input 
                type="text" 
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-10 md:w-16 focus:w-20 md:focus:w-32 bg-transparent border-none outline-none text-[9px] uppercase font-black tracking-wider ml-1.5 placeholder:text-neutral-700 transition-all"
              />
            </div>
          </header>
        </div>

        {/* Game Grid - Poki Style Bento Grid (Dense) */}
        <section className="w-full pb-20">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 grid-auto-rows-[100px] md:grid-auto-rows-[140px] grid-flow-dense gap-4">
            <AnimatePresence>
              {filteredGames.map((game, i) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (i % 20) * 0.01 }}
                  layout
                  className={cn(
                    "relative",
                    game.size === 'large' ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
                  )}
                >
                  <GameCard game={game as any} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredGames.length === 0 && (
            <div className="w-full py-40 flex flex-col items-center opacity-20">
              <p className="text-2xl font-black uppercase tracking-[0.2em]">Zero Results</p>
            </div>
          )}
        </section>

        {/* Footer Meta */}
        <footer className="py-10 opacity-10 text-[10px] font-black uppercase tracking-[0.4em] text-center border-t border-white/5">
          Vortex Grid // Anonymous Play // DuckMath Engine
        </footer>

        {/* Panic Key HUD - Bottom Right */}
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-1 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
          <div className="bg-[#1a1a1a] border border-white/5 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-2xl backdrop-blur-md">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
              Press <span className="text-white bg-neutral-800 px-1 rounded">Esc</span> to Panic
            </span>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-neutral-600 mr-1">
            DuckMath // Stealth Active
          </span>
        </div>
      </div>
    </div>
  );
}


