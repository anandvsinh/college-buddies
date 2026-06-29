import supabase from "../config/supabase.js";

export async function getEvents() {
    const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

    if (error) throw error;

    return data;
}