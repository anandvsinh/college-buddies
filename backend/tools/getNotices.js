import supabase from "../config/supabase.js";

export async function getNotices() {
    const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

    if (error) throw error;

    return data;
}