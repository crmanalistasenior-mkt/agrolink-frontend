import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Publication } from '../lib/types';

export type IncomingOrder = {
  id: string;
  buyer_name: string;
  product: string;
  publication_id: string;
  qty: number;
  total: number;
  status: 'pendiente' | 'aceptado' | 'rechazado';
  date: string;
  destination: string;
};

export type LoadHistoryEntry = {
  id: string;
  origin: string;
  destination: string;
  weight: number;
  distance: number;
  price: number;
  status: 'en_transito' | 'entregado';
  accepted_date: string;
  delivered_date?: string;
};

export type Producer = {
  id: string;
  name: string;
  location: string;
  department: string;
  phone: string;
  description: string;
  member_since: string;
  total_sales: number;
  completed_orders: number;
};

interface AppDataContextType {
  publications: Publication[];
  orders: any[]; 
  loads: any[];
  incomingOrders: IncomingOrder[];
  myLoads: LoadHistoryEntry[];
  producers: Producer[];
  addOrder: (order: any) => void;
  removePublication: (id: string) => void;
  updatePublication: (id: string, data: Partial<Publication>) => void;
  addPublication: (pub: Publication) => void;
  updateLoadStatus: (id: string, status: string) => void;
  acceptIncomingOrder: (id: string) => void;
  rejectIncomingOrder: (id: string) => void;
  advanceLoadStatus: (id: string) => void;
  cancelOrder: (id: string) => void;
  togglePublicationStatus: (id: string) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const INITIAL_PUBLICATIONS: Publication[] = [
  { id: '1', producer_id: '1', producer_name: 'Estancia San Jorge', product_name: 'Tomate Santa Cruz', category: 'verduras', price_per_kg: 4500, stock_kg: 1200, location_name: 'Caaguazú', is_active: true, created_at: new Date().toISOString() },
  { id: '2', producer_id: '2', producer_name: 'Granja El Sol', product_name: 'Locote Verde', category: 'verduras', price_per_kg: 7000, stock_kg: 800, location_name: 'Itapúa', is_active: true, created_at: new Date().toISOString() },
  { id: '3', producer_id: '3', producer_name: 'Cooperativa Fernheim', product_name: 'Mandioca', category: 'granos', price_per_kg: 1500, stock_kg: 5000, location_name: 'San Pedro', is_active: true, created_at: new Date().toISOString() },
  { id: '4', producer_id: '4', producer_name: 'Agro Roque', product_name: 'Soja', category: 'granos', price_per_kg: 2100, stock_kg: 12000, location_name: 'Alto Paraná', is_active: true, created_at: new Date().toISOString() },
  { id: '5', producer_id: '1', producer_name: 'Estancia San Jorge', product_name: 'Maíz', category: 'granos', price_per_kg: 1800, stock_kg: 8500, location_name: 'Caaguazú', is_active: true, created_at: new Date().toISOString() }
];

const INITIAL_PRODUCERS: Producer[] = [
  { id:'1', name:'Estancia San Jorge', location:'Caaguazú', department:'Caaguazú', phone:'+595 981 123 456', description:'Productores de tomate y locote desde 1998. Trabajamos con técnicas orgánicas y entrega garantizada en todo el país.', member_since:'2024-01', total_sales:45000000, completed_orders:38 },
  { id:'2', name:'Granja El Sol', location:'Itapúa', department:'Itapúa', phone:'+595 982 234 567', description:'Especialistas en locote verde y pimiento. Finca familiar con certificación sanitaria vigente.', member_since:'2024-03', total_sales:28000000, completed_orders:24 },
  { id:'3', name:'Cooperativa Fernheim', location:'San Pedro', department:'San Pedro', phone:'+595 983 345 678', description:'Cooperativa agrícola con más de 50 productores asociados. Mandioca y granos de alta calidad.', member_since:'2023-11', total_sales:92000000, completed_orders:87 },
  { id:'4', name:'Agro Roque', location:'Alto Paraná', department:'Alto Paraná', phone:'+595 984 456 789', description:'Producción de soja y maíz a gran escala. Logística propia disponible para grandes volúmenes.', member_since:'2024-02', total_sales:67000000, completed_orders:61 },
];

const INITIAL_ORDERS = [
  { id:'1', date:'2026-03-10', product:'Tomate Santa Cruz', qty:800, total:3600000, status:'en_transito', producer:'Estancia San Jorge', destination:'Asunción' },
  { id:'2', date:'2026-03-08', product:'Mandioca', qty:2000, total:3000000, status:'entregado', producer:'Cooperativa Fernheim', destination:'Ciudad del Este' },
  { id:'3', date:'2026-03-12', product:'Locote Verde', qty:400, total:2800000, status:'confirmado', producer:'Granja El Sol', destination:'Encarnación' },
];

const INITIAL_LOADS = [
  { id:'1', origin:'Caaguazú', destination:'Asunción', weight:2400, distance:180, status:'publicada', price:450000 },
  { id:'2', origin:'San Pedro', destination:'Ciudad del Este', weight:5800, distance:220, status:'asignada', price:980000 },
  { id:'3', origin:'Itapúa', destination:'Asunción', weight:1200, distance:310, status:'en_transito', price:620000 },
  { id:'4', origin:'Alto Paraná', destination:'Encarnación', weight:3100, distance:90, status:'publicada', price:380000 },
];

const INITIAL_INCOMING_ORDERS: IncomingOrder[] = [
  { id:'1', buyer_name:'Supermercado Stock', product:'Tomate Santa Cruz', publication_id:'1', qty:400, total:1800000, status:'pendiente', date: new Date().toISOString(), destination:'Asunción' },
  { id:'2', buyer_name:'Restaurante Don Carlos', product:'Tomate Santa Cruz', publication_id:'1', qty:200, total:900000, status:'pendiente', date: new Date().toISOString(), destination:'Luque' },
  { id:'3', buyer_name:'Mercado 4', product:'Mandioca', publication_id:'2', qty:1000, total:1500000, status:'aceptado', date:'2026-03-10', destination:'Asunción' },
];

const INITIAL_MY_LOADS: LoadHistoryEntry[] = [
  { id:'ml-1', origin:'Caaguazú', destination:'Asunción', weight:2400, distance:180, price:450000, status:'en_transito', accepted_date:'2026-03-11' },
  { id:'ml-2', origin:'Alto Paraná', destination:'Encarnación', weight:3100, distance:90, price:380000, status:'en_transito', accepted_date:'2026-03-12' },
];

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [publications, setPublications] = useState<Publication[]>(INITIAL_PUBLICATIONS);
  const [orders, setOrders] = useState<any[]>(INITIAL_ORDERS);
  const [loads, setLoads] = useState<any[]>(INITIAL_LOADS);
  const [incomingOrders, setIncomingOrders] = useState<IncomingOrder[]>(INITIAL_INCOMING_ORDERS);
  const [myLoads, setMyLoads] = useState<LoadHistoryEntry[]>(INITIAL_MY_LOADS);
  const [producers] = useState<Producer[]>(INITIAL_PRODUCERS);

  const addOrder = (order: any) => {
    setOrders(prev => [order, ...prev]);
  };

  const removePublication = (id: string) => {
    setPublications(prev => prev.filter(p => p.id !== id));
  };

  const updatePublication = (id: string, data: Partial<Publication>) => {
    setPublications(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const addPublication = (pub: Publication) => {
    setPublications(prev => [pub, ...prev]);
  };

  const updateLoadStatus = (id: string, status: string) => {
    setLoads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const acceptIncomingOrder = (id: string) => {
    const orderToAccept = incomingOrders.find(o => o.id === id);
    if (!orderToAccept) return;

    setIncomingOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'aceptado' } : o));

    const pub = publications.find(p => p.id === orderToAccept.publication_id);
    const newLoad = {
      id: crypto.randomUUID(),
      origin: pub?.location_name || 'Productor',
      destination: orderToAccept.destination,
      weight: orderToAccept.qty,
      distance: 0,
      status: 'publicada' as const,
      price: 0,
      publication_id: orderToAccept.publication_id,
    };
    
    setLoads(prev => [...prev, newLoad]);
  };

  const rejectIncomingOrder = (id: string) => {
    setIncomingOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'rechazado' } : o));
  };

  const advanceLoadStatus = (id: string) => {
    setMyLoads(prev => prev.map(l => {
      if (l.id === id && l.status === 'en_transito') {
        const updated = { ...l, status: 'entregado' as const, delivered_date: new Date().toLocaleDateString('es-PY') };
        return updated;
      }
      return l;
    }));
    setLoads(prev => prev.map(l => l.id === id ? { ...l, status: 'entregada' } : l));
  };

  const cancelOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelado' } : o));
  };

  const togglePublicationStatus = (id: string) => {
    setPublications(prev => prev.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p));
  };

  return (
    <AppDataContext.Provider value={{
      publications, orders, loads, incomingOrders, myLoads, producers,
      addOrder, removePublication, updatePublication, addPublication,
      updateLoadStatus, acceptIncomingOrder, rejectIncomingOrder, advanceLoadStatus,
      cancelOrder, togglePublicationStatus
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used within AppDataProvider');
  return context;
};
