import { useState, useEffect } from 'react';
import { ProductCard } from '../components/cards/ProductCard';
import { useUser } from '../hooks/useUser';
import { SkeletonCard } from '../components/Skeleton';
import { useAppData } from '../context/AppDataContext';

const FILTERS = ['Todos', 'Verduras', 'Frutas', 'Granos'];

export default function Market() {
  const { role } = useUser();
  const { publications } = useAppData();
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const filtered = activeCategory === 'todos'
    ? publications
    : publications.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-8">
      <header className="space-y-6">
        <div>
          <h1 className="font-heading text-4xl font-bold text-white uppercase tracking-tighter">Marketplace</h1>
          <p className="text-slate-500 mt-1 font-medium">Encuentra los mejores productos directo de finca.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const categoryValue = filter.toLowerCase();
            const isActive = activeCategory === categoryValue;

            return (
              <button
                key={filter}
                onClick={() => setActiveCategory(categoryValue)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  isActive
                    ? 'bg-brand text-slate-950 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr items-start">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        ) : (
          filtered.map((pub) => (
            <ProductCard 
              key={pub.id} 
              publication={pub} 
              role={role} 
              onAction={() => {}} 
            />
          ))
        )}
      </div>
    </div>
  );
}
