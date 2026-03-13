import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { LoadCard } from '../components/LoadCard';
import { Truck } from 'lucide-react';
import { SkeletonCard } from '../components/Skeleton';
import { useAppData } from '../context/AppDataContext';
import { ViewToggle, type ViewMode } from '../components/ViewToggle';
import { AceptarCargaModal } from '../components/AceptarCargaModal';
import { useToast } from '../context/ToastContext';
import { AnimatePresence } from 'framer-motion';

const FILTERS = ['Todas', 'Disponibles', 'En tránsito'];
const DEPARTMENTS = [
  'Asunción', 'Concepción', 'San Pedro', 'Cordillera', 'Guairá', 
  'Caaguazú', 'Caazapá', 'Itapúa', 'Misiones', 'Paraguarí', 
  'Alto Paraná', 'Central', 'Ñeembucú', 'Amambay', 'Canindeyú', 
  'Presidente Hayes', 'Alto Paraguay', 'Boquerón'
];

const statusConfig: Record<string, { color: string, bg: string, border: string, label: string }> = {
  publicada: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Publicada' },
  asignada: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Asignada' },
  en_transito: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'En Tránsito' },
  entregada: { color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20', label: 'Entregada' },
};

export default function Loads() {
  const { role } = useUser();
  const navigate = useNavigate();
  const { loads, updateLoadStatus } = useAppData();
  const { showToast } = useToast();
  const [filter, setFilter] = useState('Todas');
  const [deptFilter, setDeptFilter] = useState('');
  const [minWeight, setMinWeight] = useState('');
  const [maxWeight, setMaxWeight] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>(
    () => (localStorage.getItem('loadsView') as ViewMode) ?? 'grid'
  );
  const [selectedLoad, setSelectedLoad] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => localStorage.setItem('loadsView', viewMode), [viewMode]);

  const handleConfirmAccept = () => {
    if (!selectedLoad) return;
    updateLoadStatus(selectedLoad.id, 'asignada');
    showToast('Carga aceptada. ¡Buen viaje!', 'success');
    setShowModal(false);
    setSelectedLoad(null);
  };

  const filteredLoads = loads.filter((load) => {
    const matchesStatus = filter === 'Todas' || 
                          (filter === 'Disponibles' && load.status === 'publicada') ||
                          (filter === 'En tránsito' && load.status === 'en_transito');
    
    // Some mock data has origin string containing the department
    const matchesDept = !deptFilter || (load.origin && load.origin.includes(deptFilter));
    
    const w = load.weight || 0;
    const matchesMinWeight = !minWeight || w >= Number(minWeight);
    const matchesMaxWeight = !maxWeight || w <= Number(maxWeight);

    return matchesStatus && matchesDept && matchesMinWeight && matchesMaxWeight;
  });

  const availableCount = loads.filter(l => l.status === 'publicada').length;

  const clearFilters = () => {
    setFilter('Todas');
    setDeptFilter('');
    setMinWeight('');
    setMaxWeight('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Transporter Banner */}
      {role === 'transporter' && availableCount > 0 && !isLoading && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-emerald-500 p-2 rounded-xl text-slate-950">
            <Truck size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-tight">Oportunidad de Carga</p>
            <p className="text-xs text-emerald-500 font-medium lowercase">Tenés {availableCount} cargas disponibles en tu zona listas para ser aceptadas.</p>
          </div>
        </div>
      )}

      <header className="space-y-6">
        <div>
          <h1 className="font-heading text-4xl font-bold text-white uppercase tracking-tighter">Cargas Disponibles</h1>
          <p className="text-slate-500 mt-1 font-medium">Bolsa de fletes activa. Gestioná tu logística en tiempo real.</p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    filter === f 
                      ? 'bg-brand text-slate-950 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                      : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <ViewToggle mode={viewMode} onChange={setViewMode} />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <select 
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-[#0a1628] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-brand/40"
            >
              <option value="">Todos los departamentos</option>
              {DEPARTMENTS.sort().map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <input 
              type="number" 
              placeholder="Peso mín (kg)" 
              value={minWeight}
              onChange={(e) => setMinWeight(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-brand/40 w-32 placeholder:text-slate-500"
            />
            <input 
              type="number" 
              placeholder="Peso máx (kg)" 
              value={maxWeight}
              onChange={(e) => setMaxWeight(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-brand/40 w-32 placeholder:text-slate-500"
            />
            <div className="flex-1 text-right min-w-[120px]">
              {/* Only show clear button if any filter is active */}
              {(filter !== 'Todas' || deptFilter || minWeight || maxWeight) && (
                <button 
                  onClick={clearFilters}
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {viewMode === 'list' && !isLoading ? (
        <div className="flex flex-col gap-2">
          {filteredLoads.map((load) => {
            const config = statusConfig[load.status] || { bg: 'bg-gray-500/10', text: 'text-gray-500', label: load.status };
            return (
              <div 
                key={load.id}
                onClick={() => navigate(`/loads/${load.id}`)}
                className="flex items-center gap-4 px-5 py-3 h-20 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500/30 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-xl">
                  🚛
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-lg text-white truncate leading-none mb-1">{load.origin} → {load.destination}</p>
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                <div className="hidden md:block text-slate-400 font-medium text-sm min-w-[90px]">{load.weight.toLocaleString()} kg</div>
                <div className="hidden md:block text-slate-400 font-medium text-sm min-w-[80px]">{load.distance} km</div>
                <div className="text-right min-w-[130px]">
                  <span className="font-heading text-xl text-emerald-400">{load.price.toLocaleString()}</span>
                  <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest ml-1">Gs</span>
                </div>
                {role === 'transporter' && load.status === 'publicada' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedLoad(load); setShowModal(true) }}
                    className="flex-shrink-0 ml-4 px-4 py-2 bg-brand hover:bg-emerald-400 text-slate-950 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors h-9"
                  >
                    Aceptar
                  </button>
                )}
              </div>
            );
          })}

          {filteredLoads.length === 0 && (
            <div className="col-span-full py-20 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-slate-500 italic">
              No se encontraron cargas para estos filtros.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr items-start">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : (
            <>
              {filteredLoads.map((load) => (
                <LoadCard 
                  key={load.id} 
                  load={load} 
                  role={role}
                  onAccept={() => {}} 
                />
              ))}

              {filteredLoads.length === 0 && (
                <div className="col-span-full py-20 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-slate-500 italic">
                  No se encontraron cargas para estos filtros.
                </div>
              )}
            </>
          )}
        </div>
      )}

      <AnimatePresence>
        {showModal && selectedLoad && (
          <AceptarCargaModal 
            load={selectedLoad}
            onClose={() => {
              setShowModal(false);
              setSelectedLoad(null);
            }}
            onConfirm={handleConfirmAccept}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
