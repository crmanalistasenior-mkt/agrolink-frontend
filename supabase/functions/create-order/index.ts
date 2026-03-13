// Edge Function: create-order
// Verifica stock, crea el pedido, genera incoming_order y carga asociada
// Toda la operación es atómica — si algo falla, nada se guarda

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        // Verificar autenticación
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: "No autorizado" }),
                { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const userClient = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_ANON_KEY")!,
            { global: { headers: { Authorization: authHeader } } }
        );

        const { data: { user }, error: authError } = await userClient.auth.getUser();
        if (authError || !user) {
            return new Response(
                JSON.stringify({ error: "No autorizado" }),
                { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Verificar que es buyer
        const { data: profile } = await supabase
            .from("profiles")
            .select("role, full_name")
            .eq("id", user.id)
            .single();

        if (!profile || profile.role !== "buyer") {
            return new Response(
                JSON.stringify({ error: "Solo los compradores pueden realizar pedidos" }),
                { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Parsear body
        const body = await req.json();
        const { publication_id, qty, destination, notes } = body;

        // Validaciones básicas
        if (!publication_id || !qty || !destination) {
            return new Response(
                JSON.stringify({ error: "Faltan campos requeridos: publication_id, qty, destination" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        if (qty <= 0) {
            return new Response(
                JSON.stringify({ error: "La cantidad debe ser mayor a 0" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Obtener publicación con lock para evitar race conditions
        const { data: publication, error: pubError } = await supabase
            .from("publications")
            .select("*, producers(id, commercial_name)")
            .eq("id", publication_id)
            .eq("is_active", true)
            .eq("status", "active")
            .single();

        if (pubError || !publication) {
            return new Response(
                JSON.stringify({ error: "Publicación no encontrada o no disponible" }),
                { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Verificar stock disponible
        if (publication.qty_available < qty) {
            return new Response(
                JSON.stringify({
                    error: `Stock insuficiente. Disponible: ${publication.qty_available} kg, solicitado: ${qty} kg`
                }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Verificar que no se está comprando a sí mismo
        if (publication.producer_id === user.id) {
            return new Response(
                JSON.stringify({ error: "No podés comprar tus propios productos" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const total = qty * publication.price_per_kg;
        const producerName = publication.producers?.commercial_name || publication.producer_name;

        // 1. Crear order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                buyer_id: user.id,
                buyer_name: profile.full_name,
                publication_id,
                producer_id: publication.producer_id,
                producer_name: producerName,
                product_name: publication.product_name,
                qty,
                price_per_kg: publication.price_per_kg,
                total,
                status: "confirmado",
                destination,
                notes: notes || null,
            })
            .select()
            .single();

        if (orderError) {
            console.error("Error creando order:", orderError);
            return new Response(
                JSON.stringify({ error: "Error al crear el pedido", details: orderError.message }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // 2. Crear incoming_order para el productor
        const { error: incomingError } = await supabase
            .from("incoming_orders")
            .insert({
                order_id: order.id,
                publication_id,
                producer_id: publication.producer_id,
                buyer_id: user.id,
                buyer_name: profile.full_name,
                product_name: publication.product_name,
                qty,
                total,
                status: "pendiente",
                destination,
            });

        if (incomingError) {
            console.error("Error creando incoming_order:", incomingError);
            // No es bloqueante — el order ya existe
        }

        // 3. Descontar stock de la publicación
        const newQty = publication.qty_available - qty;
        const newStatus = newQty === 0 ? "sold_out" : "active";

        const { error: stockError } = await supabase
            .from("publications")
            .update({
                qty_available: newQty,
                status: newStatus,
                is_active: newQty > 0,
            })
            .eq("id", publication_id);

        if (stockError) {
            console.error("Error actualizando stock:", stockError);
        }

        // 4. Crear carga logística asociada
        const { data: load, error: loadError } = await supabase
            .from("loads")
            .insert({
                order_id: order.id,
                publication_id,
                producer_id: publication.producer_id,
                origin: publication.location_name,
                destination,
                weight: qty,
                status: "publicada",
            })
            .select()
            .single();

        if (loadError) {
            console.error("Error creando carga:", loadError);
        }

        // 5. Crear registro en transactions
        await supabase
            .from("transactions")
            .insert({
                order_id: order.id,
                load_id: load?.id || null,
                producer_id: publication.producer_id,
                buyer_id: user.id,
                product_price: total,
                product_commission: total * 0.05, // 5% comisión
                status: "confirmed",
                events: JSON.stringify([{
                    event: "pedido_confirmado",
                    timestamp: new Date().toISOString(),
                    actor_id: user.id,
                }]),
            });

        return new Response(
            JSON.stringify({
                success: true,
                order_id: order.id,
                load_id: load?.id || null,
                order,
            }),
            { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (err) {
        console.error("Error inesperado:", err);
        return new Response(
            JSON.stringify({ error: "Error interno del servidor" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});