import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { ProductCard } from '../components/cards/ProductCard';
import { PublishForm } from '../components/PublishForm';
import { Trash2, ShieldAlert, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Publication } from '../lib/types';
import { useToast } from '../context/ToastContext';
import { useAppData } from '../context/AppDataContext';

export default function MyProducts() {
  const { user, role } = useUser();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { publications, addPublication, removePublication, updatePublication, togglePublicationStatus } = useAppData();
  
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Publication | null>(null);

  // Filter only my products
  const myProducts = publications.filter(p => p.producer_id === 'p1' || p.producer_id === 'mock-id-producer' || p.producer_id === 'current-user');

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (role !== 'producer' && user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 text-center">
        <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20">
          <ShieldAlert size={64} className="text-red-500 mx-auto" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading text-3xl font-bold text-white uppercase tracking-tight">Acceso Denegado</h2>
          <p className="text-slate-500 max-w-xs mx-auto">Esta sección es de uso exclusivo para perfiles de Productores registrados.</p>
        </div>
        <button 
          onClick={() => navigate('/market')}
          className="btn-secondary group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Volver al Marketplace
        </button>
      </div>
    );
  }

  const handleFormSubmit = (product: Publication) => {
    if (editingProduct) {
      updatePublication(product.id, product);
      showToast('Cambios guardados', 'success');
      setEditingProduct(null);
    } else {
      addPublication({ ...product, isNew: true, is_active: true } as any);
      showToast('Producto publicado', 'success');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta publicación?')) {
      removePublication(id);
      showToast('Publicación eliminada', 'warning');
    }
  };

  const handleToggle = (id: string, active: boolean) => {
    togglePublicationStatus(id);
    showToast(active ? 'Publicación pausada' : 'Publicación activada', 'info');
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-4xl font-bold text-white uppercase tracking-tighter">Mis Productos</h1>
        <p className="text-slate-500 mt-1 font-medium">Gestioná tu inventario y publicaciones activas.</p>
      </header>

      <div className="flex gap-8 items-start">
        {/* Left Side: Product List (2/3) */}
        <div className="w-2/3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {myProducts.map((pub) => (
                <motion.div
                  key={pub.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    boxShadow: (pub as any).isNew ? "0 0 20px rgba(34, 197, 94, 0.4)" : "none"
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className={`relative group/my-product ${(pub as any).isNew ? 'animate-pulse' : ''}`}
                >
                  <Link to={`/my-products/${pub.id}`} className="block h-full group">
                    <ProductCard 
                      publication={pub} 
                      role={null} 
                    />
                    <div className="absolute bottom-4 left-6 text-[10px] font-bold text-white/20 group-hover:text-brand uppercase tracking-widest transition-colors">
                        Ver detalle →
                    </div>
                  </Link>
                  
                  {/* Options Menu */}
                  <div className="absolute top-3 right-3 z-30" onMouseDown={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === pub.id ? null : pub.id);
                      }}
                      className="w-10 h-10 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all shadow-xl"
                    >
                      ···
                    </button>

                    <AnimatePresence>
                      {openMenu === pub.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute top-12 right-0 bg-[#0f1a12] border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[160px] z-50"
                        >
                          <button 
                            onClick={() => {
                              handleToggle(pub.id, pub.is_active);
                              setOpenMenu(null);
                            }}
                            className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-white/70 hover:bg-white/5 hover:text-white flex items-center gap-3 transition-colors"
                          >
                            <span>{pub.is_active ? '⏸ Pausar' : '▶ Activar'}</span>
                          </button>
                          
                          <button 
                            onClick={() => {
                              setEditingProduct(pub);
                              setOpenMenu(null);
                            }}
                            className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-white/70 hover:bg-white/5 hover:text-white flex items-center gap-3 transition-colors border-t border-white/5"
                          >
                            <span>✏️ Editar</span>
                          </button>
                          
                          <button 
                            onClick={() => {
                              handleDelete(pub.id);
                              setOpenMenu(null);
                            }}
                            className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-red-400/80 hover:bg-red-500/10 hover:text-red-400 flex items-center gap-3 transition-colors border-t border-white/5"
                          >
                            <span>🗑️ Eliminar</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {myProducts.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 border-2 border-dashed border-brand/20 rounded-3xl flex flex-col items-center justify-center text-slate-500 space-y-4"
            >
              <div className="bg-brand/5 p-4 rounded-full">
                <Trash2 size={32} className="text-brand/30" />
              </div>
              <p className="text-lg font-medium">Aún no publicaste ningún producto</p>
            </motion.div>
          )}
        </div>

        {/* Right Side: Publish Form (1/3) */}
        <div className="w-1/3">
          <PublishForm 
            onSubmit={handleFormSubmit} 
            editingProduct={editingProduct}
          />
          {editingProduct && (
            <button 
              onClick={() => setEditingProduct(null)}
              className="w-full mt-4 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors"
            >
              Cancelar Edición
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
