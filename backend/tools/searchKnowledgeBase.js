import supabase from "../config/supabase.js";

export async function searchKnowledgeBase(keyword) {
    const { data, error } = await supabase
        .from("knowledge_base")
        .select("title, category, content, tags")
        .or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`);

    if (error) throw error;

    return data;
}