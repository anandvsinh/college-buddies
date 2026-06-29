import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { toolDeclarations } from "./tools.js";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function askGemini(contents, tools = []) {

    return await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
            tools: toolDeclarations
        }
    });

}