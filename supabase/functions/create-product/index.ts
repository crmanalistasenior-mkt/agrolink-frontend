// Edge Function: create-product
// Valida y crea una publicación en el marketplace
// Usar con service_role para bypass RLS

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // Cliente con service_role para bypass RLS
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        // Cliente con JWT del usuario para verificar autenticación
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

        // Verificar usuario autenticado
        const { data: { user }, error: authError } = await userClient.auth.getUser();
        if (authError || !user) {
            return new Response(
                JSON.stringify({ error: "No autorizado" }),
                { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Verificar que el usuario es producer
        const { data: profile } = await supabase
            .from("profiles")
            .select("role, full_name")
            .eq("id", user.id)
            .single();

        if (!profile || profile.role !== "producer") {
            return new Response(
                JSON.stringify({ error: "Solo los productores pueden publicar productos" }),
                { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Verificar que existe en producers
        const { data: producer } = await supabase
            .from("producers")
            .select("id, commercial_name")
            .eq("id", user.id)
            .single();

        if (!producer) {
            return new Response(
                JSON.stringify({ error: "Perfil de productor no encontrado" }),
                { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Parsear body
        const body = await req.json();
        const {
            product_name,
            category,
            qty_available,
            price_per_kg,
            location_name,
            department,
            available_from,
        } = body;

        // Validaciones
        if (!product_name || !category || !qty_available || !price_per_kg || !location_name || !department) {
            return new Response(
                JSON.stringify({ error: "Faltan campos requeridos: product_name, category, qty_available, price_per_kg, location_name, department" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        if (qty_available <= 0) {
            return new Response(
                JSON.stringify({ error: "La cantidad disponible debe ser mayor a 0" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        if (price_per_kg <= 0) {
            return new Response(
                JSON.stringify({ error: "El precio por kg debe ser mayor a 0" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const validCategories = ["verduras", "frutas", "granos", "legumbres", "otros"];
        if (!validCategories.includes(category)) {
            return new Response(
                JSON.stringify({ error: `Categoría inválida. Opciones: ${validCategories.join(", ")}` }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Crear publicación
        const { data: publication, error: pubError } = await supabase
            .from("publications")
            .insert({
                producer_id: user.id,
                producer_name: producer.commercial_name || profile.full_name,
                product_name,
                category,
                qty_available,
                qty_original: qty_available,
                price_per_kg,
                location_name,
                department,
                available_from: available_from || new Date().toISOString().split("T")[0],
                status: "active",
                is_active: true,
            })
            .select()
            .single();

        if (pubError) {
            console.error("Error creando publicación:", pubError);
            return new Response(
                JSON.stringify({ error: "Error al crear la publicación", details: pubError.message }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, publication_id: publication.id, publication }),
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