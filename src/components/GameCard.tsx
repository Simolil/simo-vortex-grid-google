import { motion } from 'motion/react';
import { openCloaked } from '../lib/cloak';

interface Game {
  id: string;
  title: string;
  thumbnail: string;
  source: string;
  category: string;
  status?: string;
  size?: 'standard' | 'large' | 'wide';
}

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const handlePlay = () => {
    openCloaked(game.source, game.title);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative w-full h-full bg-[#1a1a1a] rounded-2xl overflow-hidden cursor-pointer shadow-lg"
      onClick={handlePlay}
    >
      <img 
        src={game.thumbnail} 
        alt={game.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      
      {/* Overlay Title - Visible on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <h3 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider leading-tight">
          {game.title}
        </h3>
      </div>

      {/* Status Badge (Mini) */}
      {game.status && (
        <div className="absolute top-2 right-2 z-10">
          <div className={`w-1.5 h-1.5 rounded-full ${game.status === 'hot' ? 'bg-orange-500' : 'bg-emerald-500'} shadow-[0_0_5px_rgba(0,0,0,0.5)]`} />
        </div>
      )}
    </motion.div>
  );
}
