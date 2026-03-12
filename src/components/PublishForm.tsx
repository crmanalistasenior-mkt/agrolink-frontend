import { useState, useEffect, type FormEvent } from 'react';
import type { Publication } from '../lib/types';

interface Props {
  onSubmit: (publication: Publication) => void;
  editingProduct?: Publication | null;
}

const CATEGORIES = ['Verduras', 'Frutas', 'Granos', 'Legumbres', 'Otros'];
const DEPARTMENTS = [
  'Asunción', 'Central', 'Alto Paraná', 'Itapúa', 'Caaguazú', 
  'San Pedro', 'Canindeyú', 'Cordillera', 'Paraguarí', 'Misiones', 
  'Ñeembucú', 'Amambay', 'Concepción', 'Presidente Hayes', 
  'Alto Paraguay', 'Boquerón'
];

export const PublishForm = ({ onSubmit, editingProduct }: Props) => {
  const [formData, setFormData] = useState({
    product_name: '',
    category: 'Verduras',
    stock_kg: '',
    price_per_kg: '',
    location_name: 'Asunción'
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        product_name: editingProduct.product_name,
        category: editingProduct.category || 'Verduras',
        stock_kg: editingProduct.stock_kg.toString(),
        price_per_kg: editingProduct.price_per_kg.toString(),
        location_name: editingProduct.location_name
      });
    } else {
      setFormData({
        product_name: '',
        category: 'Verduras',
        stock_kg: '',
        price_per_kg: '',
        location_name: 'Asunción'
      });
    }
  }, [editingProduct]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...editingProduct,
      id: editingProduct?.id || Math.random().toString(36).substring(2, 9),
      producer_id: editingProduct?.producer_id || 'current-user',
      producer_name: editingProduct?.producer_name || 'Yo (Productor)',
      product_name: formData.product_name,
      category: formData.category,
      stock_kg: Number(formData.stock_kg),
      price_per_kg: Number(formData.price_per_kg),
      location_name: formData.location_name,
      created_at: editingProduct?.created_at || new Date().toISOString()
    } as Publication);
    
    if (!editingProduct) {
      setFormData({
        product_name: '',
        category: 'Verduras',
        stock_kg: '',
        price_per_kg: '',
        location_name: 'Asunción'
      });
    }
  };

  return (
    <div className="glass-card p-6 sticky top-8 text-left">
      <h2 className="font-heading text-2xl font-bold text-white uppercase tracking-tight mb-6 border-b border-brand/20 pb-4">
        {editingProduct ? 'Editar Publicación' : 'Nueva Publicación'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-widest text-brand/70">Nombre del Producto</label>
          <input
            required
            type="text"
            placeholder="Ej: Tomate Lisol"
            value={formData.product_name}
            onChange={e => setFormData({ ...formData, product_name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand focus:outline-none transition-all placeholder:text-slate-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-brand/70">Categoría</label>
            <select
              required
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-brand focus:outline-none transition-all cursor-pointer"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-brand/70">Disponible (kg)</label>
            <div className="relative">
              <input
                required
                type="number"
                value={formData.stock_kg}
                onChange={e => setFormData({ ...formData, stock_kg: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand focus:outline-none transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500 uppercase">KG</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-widest text-brand/70">Precio por KG</label>
          <div className="relative">
            <input
              required
              type="number"
              value={formData.price_per_kg}
              onChange={e => setFormData({ ...formData, price_per_kg: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand focus:outline-none transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500 uppercase">GS</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-widest text-brand/70">Departamento</label>
          <select
            required
            value={formData.location_name}
            onChange={e => setFormData({ ...formData, location_name: e.target.value })}
            className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-brand focus:outline-none transition-all cursor-pointer"
          >
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <button
          type="submit"
          className="w-full btn-primary py-3 px-6 mt-4 uppercase tracking-widest text-xs h-12 flex justify-center items-center"
        >
          {editingProduct ? 'Guardar Cambios' : 'Publicar Producto'}
        </button>
      </form>
    </div>
  );
};
