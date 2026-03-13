// Edge Function: accept-load
// Asigna un transportista a una carga usando locking optimista
// Previene doble asignación con try_lock_load + transacción atómica

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

        // Verificar que es transporter
        const { data: profile } = await supabase
            .from("profiles")
            .select("role, full_name")
            .eq("id", user.id)
            .single();

        if (!profile || profile.role !== "transporter") {
            return new Response(
                JSON.stringify({ error: "Solo los transportistas pueden aceptar cargas" }),
                { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Parsear body
        const body = await req.json();
        const { load_id } = body;

        if (!load_id) {
            return new Response(
                JSON.stringify({ error: "Falta el campo requerido: load_id" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Verificar que la carga existe y está disponible
        const { data: load, error: loadError } = await supabase
            .from("loads")
            .select("*")
            .eq("id", load_id)
            .single();

        if (loadError || !load) {
            return new Response(
                JSON.stringify({ error: "Carga no encontrada" }),
                { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        if (load.status !== "publicada") {
            return new Response(
                JSON.stringify({ error: `La carga no está disponible. Estado actual: ${load.status}` }),
                { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Intentar locking optimista usando la función SQL
        const { data: lockResult, error: lockError } = await supabase
            .rpc("try_lock_load", {
                p_load_id: load_id,
                p_transporter_id: user.id,
                p_lock_seconds: 30,
            });

        if (lockError || !lockResult) {
            return new Response(
                JSON.stringify({ error: "La carga ya fue tomada por otro transportista. Intentá con otra." }),
                { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Lock obtenido — asignar definitivamente
        const { data: updatedLoad, error: assignError } = await supabase
            .from("loads")
            .update({
                transporter_id: user.id,
                status: "asignada",
                accepted_at: new Date().toISOString(),
                locked_by: null,
                locked_at: null,
            })
            .eq("id", load_id)
            .select()
            .single();

        if (assignError) {
            console.error("Error asignando carga:", assignError);
            return new Response(
                JSON.stringify({ error: "Error al asignar la carga", details: assignError.message }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Actualizar order relacionada a en_transito
        if (load.order_id) {
            await supabase
                .from("orders")
                .update({ status: "en_transito" })
                .eq("id", load.order_id);

            // Actualizar incoming_order a aceptado
            await supabase
                .from("incoming_orders")
                .update({ status: "aceptado" })
                .eq("order_id", load.order_id);

            // Agregar evento a transaction
            const { data: transaction } = await supabase
                .from("transactions")
                .select("id, events, freight_price, freight_commission")
                .eq("order_id", load.order_id)
                .single();

            if (transaction) {
                const events = Array.isArray(transaction.events)
                    ? transaction.events
                    : JSON.parse(transaction.events || "[]");

                events.push({
                    event: "transporte_asignado",
                    timestamp: new Date().toISOString(),
                    actor_id: user.id,
                });

                await supabase
                    .from("transactions")
                    .update({
                        transporter_id: user.id,
                        load_id: load_id,
                        freight_price: load.price || 0,
                        freight_commission: (load.price || 0) * 0.07, // 7% comisión flete
                        status: "in_transit",
                        events: JSON.stringify(events),
                    })
                    .eq("id", transaction.id);
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                load: updatedLoad,
                message: `Carga asignada correctamente a ${profile.full_name}`,
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (err) {
        console.error("Error inesperado:", err);
        return new Response(
            JSON.stringify({ error: "Error interno del servidor" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});