import express from "express";
import { chatWithAI } from "../controllers/chatController.js";
import { getUsers } from "../tools/getUsers.js";
import { searchKnowledgeBase } from "../tools/searchKnowledgebase.js";

const router = express.Router();

router.post("/", chatWithAI);

router.get("/users", async (req, res) => {
    const users = await getUsers();
    res.json(users);
});

router.get("/knowledge", async (req, res) => {
    const keyword = req.query.q;

    if (!keyword) {
        return res.status(400).json({
            error: "Please provide ?q=keyword"
        });
    }

    const data = await searchKnowledgeBase(keyword);
    res.json(data);
});


export default router;