import { NavLink, Link } from 'react-router-dom';
import { ShoppingBag, Truck, Package, ClipboardList, LogOut, UserCircle, Inbox, LayoutDashboard } from 'lucide-react';
import { useUser } from '../../hooks/useUser';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['producer', 'buyer', 'transporter'] },
  { label: 'Market', path: '/market', icon: ShoppingBag, roles: ['buyer', 'producer', 'transporter'] },
  { label: 'Loads', path: '/loads', icon: Truck, roles: ['transporter', 'admin'] },
  { label: 'Mis Cargas', path: '/my-loads', icon: Truck, roles: ['transporter', 'admin'] },
  { label: 'My Products', path: '/my-products', icon: Package, roles: ['producer', 'admin'] },
  { label: 'Pedidos Recibidos', path: '/incoming-orders', icon: Inbox, roles: ['producer', 'admin'] },
  { label: 'Mi Perfil Público', path: '/producer/1', icon: UserCircle, roles: ['producer'] },
  { label: 'My Orders', path: '/my-orders', icon: ClipboardList, roles: ['buyer', 'admin'] },
];

interface Props {
  onNavigate?: () => void;
}

export const Sidebar = ({ onNavigate }: Props) => {
  const { user, role, signOut } = useUser();

  const visibleItems = NAV_ITEMS.filter(item => 
    role === 'admin' || (role && item.roles.includes(role as any))
  );

  return (
    <aside className="w-72 border-r border-white/5 bg-slate-950/50 backdrop-blur-xl h-screen sticky top-0 flex flex-col p-6">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          <Truck className="text-slate-950" size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-2xl font-bold text-white tracking-tighter leading-none">AGROLINK</span>
          <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-1">Marketplace</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
              ${isActive 
                ? 'bg-brand text-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'}
            `}
          >
            <item.icon size={20} className={`transition-transform duration-300 group-hover:scale-110 ${false ? 'animate-pulse' : ''}`} />
            <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-4">
        <Link to="/settings" onClick={onNavigate} className="flex items-center gap-3 px-2 cursor-pointer group hover:bg-white/5 p-2 rounded-xl transition-colors">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
            <UserCircle size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white leading-none group-hover:text-emerald-400 transition-colors">{user?.full_name}</span>
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider mt-1">{user?.role}</span>
          </div>
        </Link>
        
        <button 
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-400 transition-colors text-sm font-bold uppercase tracking-wider"
        >
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
