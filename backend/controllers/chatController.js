import { runAgent } from "../services/agent.js";

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                error: "Message is required"
            });
        }

        const reply = await runAgent(message);

        res.json({
            success: true,
            reply
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};