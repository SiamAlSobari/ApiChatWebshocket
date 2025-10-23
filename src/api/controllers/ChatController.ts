import { Hono } from "hono";
import { ChatService } from "../services/ChatService";
import { ChatRepository } from "../repositories/ChatRepository";

const chatRepo = new ChatRepository();
const chatService = new ChatService(chatRepo);
export const chatController = new Hono();

chatController.post("/", async (c) => {
    const payload = await c.req.json();
    const chat = await chatService.createChatRoom(
        payload.creator_id,
        payload.participant_id,
        payload.type,
        payload.group_name
    );
    return c.json({
        "message": "Chat room created successfully",
        "data": chat
    }, 201);
})