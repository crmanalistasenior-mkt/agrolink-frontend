import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { Truck, CheckCircle2, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { signIn } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    console.log('login', email, password);
    // Real auth later
  };

  const handleDevRole = (role: 'producer' | 'buyer' | 'transporter') => {
    signIn(role);
    const redirectByRole = { buyer: '/market', producer: '/dashboard', transporter: '/loads' };
    navigate(redirectByRole[role]);
  };

  return (
    <div className="min-h-screen bg-[#020617] grid grid-cols-1 lg:grid-cols-2">
      {/* Left Col: Branding Panel */}
      <div className="hidden lg:flex flex-col justify-center p-20 bg-emerald-950/20 border-r border-emerald-500/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05),transparent)] animate-pulse" />
        
        <div className="relative z-10 space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)]">
              <Truck className="text-slate-950" size={38} strokeWidth={2.5} />
            </div>
            <h1 className="font-heading text-6xl font-bold text-white tracking-tighter uppercase">AgroLink</h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-heading font-medium text-emerald-500 leading-tight">
              Conectamos el campo <br /> con el mercado
            </h2>
            <div className="h-1 w-20 bg-brand rounded-full" />
          </div>

          <ul className="space-y-6">
            {[
              "Productores de todo Paraguay",
              "Compradores directos sin intermediarios",
              "Logística en tiempo real"
            ].map((text, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-4 text-slate-300"
              >
                <CheckCircle2 size={20} className="text-emerald-500" />
                <span className="text-lg font-medium tracking-tight">{text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="absolute bottom-10 left-20">
          <p className="text-slate-600 text-[10px] uppercase font-bold tracking-[0.3em]">
            Powered by Supabase + Vercel
          </p>
        </div>
      </div>

      {/* Right Col: Login Form */}
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 lg:p-20 relative">
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center">
              <Truck className="text-slate-950" size={28} />
            </div>
            <h1 className="font-heading text-3xl font-bold text-white uppercase tracking-tighter">AgroLink</h1>
        </div>

        <div className="w-full max-w-md space-y-10">
          <div className="text-center lg:text-left">
            <h2 className="font-heading text-4xl font-bold text-white uppercase tracking-tight">Bienvenido</h2>
            <p className="text-slate-500 mt-2 font-medium">Ingresá a tu cuenta para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-500/70 ml-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-white focus:border-brand focus:outline-none transition-all placeholder:text-slate-600"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-500/70 ml-1">Contraseña</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-white focus:border-brand focus:outline-none transition-all placeholder:text-slate-600"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-4 uppercase tracking-widest text-xs font-bold h-14 shadow-xl shadow-brand/10"
            >
              Ingresar
            </button>
          </form>

          <div className="text-center">
            <p className="text-white/40 text-sm">
              ¿No tenés cuenta? <span className="text-brand font-bold cursor-pointer hover:underline">Registrate</span>
            </p>
          </div>

          {/* Dev Role Switcher */}
          <div className="pt-8 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                <span className="bg-[#020617] px-4 text-white/20">— dev: cambiar rol —</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: 'Comprador', role: 'buyer' },
                { label: 'Productor', role: 'producer' },
                { label: 'Transportista', role: 'transporter' }
              ].map((item) => (
                <button
                  key={item.role}
                  onClick={() => handleDevRole(item.role as any)}
                  className="bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full hover:border-emerald-500/30 hover:text-white/60 hover:bg-white/10 transition-all"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
