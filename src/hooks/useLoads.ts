import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Load } from '../lib/types';

const INITIAL_LOADS: Load[] = [
  {
    id: '1',
    order_id: 'ord-1',
    product_name: 'Tomate Santa Cruz',
    origin: 'Caaguazú',
    destination: 'Asunción',
    weight_kg: 2000,
    status: 'publicada',
    distance_km: 180
  },
  {
    id: '2',
    order_id: 'ord-2',
    product_name: 'Mandioca',
    origin: 'Itapúa',
    destination: 'Ciudad del Este',
    weight_kg: 5000,
    status: 'publicada',
    distance_km: 250
  }
];

export const useLoads = () => {
  const [loads, setLoads] = useState<Load[]>(INITIAL_LOADS);

  useEffect(() => {
    const channel = supabase
      .channel('loads-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'loads' },
        (payload) => {
          console.log('Load updated:', payload);
          setLoads((prev) => 
            prev.map((load) => load.id === payload.new.id ? { ...load, ...payload.new } : load)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { loads, setLoads };
};
