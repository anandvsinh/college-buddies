import supabase from "../config/supabase.js";

export async function getUsers() {
    const { data, error } = await supabase
        .from("users")
        .select("*");

    console.log("Data:", data);
    console.log("Error:", error);

    if (error) throw error;

    return data;
}