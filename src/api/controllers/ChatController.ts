import { Hono } from "hono";
import { ChatService } from "../services/ChatService";
import { ChatRepository } from "../repositories/ChatRepository";

const chatRepo = new ChatRepository();
const chatService = new ChatService(chatRepo);
export const chatController = new Hono();

