import { askGemini } from "./gemini.js";
import { systemPrompt } from "../prompts/systemPrompt.js";
import { toolFunctions, toolDeclarations } from "./tools.js";

export async function runAgent(message){

    const contents = [
        {
            role:"user",
            parts:[
                {
                    text:`
${systemPrompt}

Student:
${message}
`
                }
            ]
        }
    ];

    const response = await askGemini(contents, toolDeclarations);

    const functionCall = response.functionCalls?.[0];

if (functionCall) {

    const { name, args } = functionCall;

    const result = await toolFunctions[name](
        ...Object.values(args || {})
    );

    // Ask Gemini again using the tool result
    const finalResponse = await askGemini([
        {
            role: "user",
            parts: [
                {
                    text: `
${systemPrompt}

Student asked:

${message}

The function "${name}" returned this data:

${JSON.stringify(result)}

Answer the student naturally using this data.
`
                }
            ]
        }
    ]);

    return finalResponse.text;
}

return response.text;
}