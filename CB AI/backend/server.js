import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { runAgent } from "./services/agent.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/chat", chatRoutes);

app.get("/", (req, res) => {
    res.send("College Buddies AI Backend is running 🚀");
});

app.get("/chat", (req, res) => {
  res.send("Chat endpoint is working!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});