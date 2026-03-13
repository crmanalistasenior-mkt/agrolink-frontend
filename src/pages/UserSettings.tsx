import { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { useToast } from '../context/ToastContext';
import { UserCircle, Save, Bell, Shield, MapPin, Truck, ShoppingBag, Store } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserSettings() {
  const { user, role } = useUser();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    phone: '',
    email: '',
    location: '',
    notifications: true
  });

  const getRoleIcon = () => {
    switch (role) {
      case 'transporter': return <Truck className="text-emerald-500" size={32} />;
      case 'buyer': return <ShoppingBag className="text-emerald-500" size={32} />;
      case 'producer': return <Store className="text-emerald-500" size={32} />;
      default: return <UserCircle className="text-emerald-500" size={32} />;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    showToast('Perfil actualizado exitosamente', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header className="space-y-2 mb-10">
        <h1 className="font-heading text-4xl font-bold text-white uppercase tracking-tighter">Mi Perfil</h1>
        <p className="text-slate-500 font-medium">Gestioná tu información personal y ajustes de cuenta.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar / Quick Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-6 border border-white/5 flex flex-col items-center text-center">
            <div className="w-24 h-24 mb-4 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex flex-col items-center justify-center relative group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <p className="text-[10px] font-bold text-white uppercase tracking-widest text-center mt-6">Cambiar<br/>Foto</p>
                </div>
                {getRoleIcon()}
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">{user?.full_name}</h2>
            <div className="mt-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{role}</span>
            </div>
          </div>

          <div className="glass-card overflow-hidden border border-white/5">
            <nav className="flex flex-col">
               <button className="flex items-center gap-3 px-6 py-4 bg-white/5 border-l-2 border-emerald-500 text-white text-sm font-bold uppercase tracking-widest">
                 <UserCircle size={18} className="text-emerald-500" /> Datos Personales
               </button>
               <button className="flex items-center gap-3 px-6 py-4 hover:bg-white/5 border-l-2 border-transparent text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                 <Shield size={18} /> Seguridad
               </button>
               <button className="flex items-center gap-3 px-6 py-4 hover:bg-white/5 border-l-2 border-transparent text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                 <Bell size={18} /> Alertas
               </button>
            </nav>
          </div>
        </div>

        {/* Main Settings Form */}
        <div className="md:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border border-white/5 p-8"
          >
            <form onSubmit={handleSave} className="space-y-6">
              <h3 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] border-b border-white/5 pb-2 mb-6">
                Información Básica
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nombre Completo</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-[#0a1628] border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Número de Teléfono</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">+595</span>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder=" 981 123 456"
                        className="w-full bg-[#0a1628] border border-white/10 rounded-xl pl-14 pr-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                      />
                    </div>
                 </div>
              </div>

              <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Correo Electrónico</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    className="w-full bg-[#0a1628] border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  />
              </div>

              <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={12} /> Ubicación Principal (Opcional)
                  </label>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ej. Asunción, Paraguay"
                    className="w-full bg-[#0a1628] border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  />
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                 <h3 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mb-4">
                    Preferencias
                 </h3>
                 <label className="flex items-center gap-4 cursor-pointer group">
                    <div className={`relative w-12 h-6 rounded-full transition-colors ${formData.notifications ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.notifications ? 'left-7' : 'left-1'}`} />
                    </div>
                    <input 
                      type="checkbox" 
                      name="notifications"
                      checked={formData.notifications}
                      onChange={handleChange}
                      className="sr-only" 
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white uppercase tracking-tight">Notificaciones Activas</span>
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Recibe alertas sobre cargas y pedidos</span>
                    </div>
                 </label>
              </div>

              <div className="pt-8 flex justify-end">
                 <button 
                  type="submit"
                  className="btn-primary py-3 px-8 flex items-center gap-2 text-xs uppercase tracking-widest"
                 >
                   <Save size={16} /> Guardar Cambios
                 </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
