import Elysia, { t } from "elysia";
import { ChatRepository } from "../chat/repository";
import { ChatService } from "../chat/service";

const chatRepo = new ChatRepository();
const chatService = new ChatService(chatRepo);
export const webshocketHandler = new Elysia({ prefix: "/ws" })
    .ws("/connect", {
        query: t.Object({
            userId: t.String(),
        }),
        async open(ws) {
            const { userId } = ws.data.query;
            const roomIds = await chatService.getChatRoom(userId);
            for (const room of roomIds) {
                ws.subscribe(room.id);
            }
            console.log(roomIds);
            ws.send(JSON.stringify({ type: "connected", roomIds, userId }));
        },
        async message(ws, raw) {
            try {
                const { userId } = ws.data.query;

                const data = typeof raw === "string" ? JSON.parse(raw) : raw;
                const { text, roomId, type } = data;

                const message = await chatService.createMessage(roomId, text, userId);
                console.log(message);

                const outgoingMessage = JSON.stringify({
                    type: type,
                    text: message.text,
                    id: message.id,
                    senderId: message.sender_id,
                    roomId: message.chat_room_id,
                    createdAt: message.createdAt,
                });
                ws.send(outgoingMessage);
                ws.publish(roomId, outgoingMessage);
            } catch (err) {
                console.error("❌ Error parsing message:", err);
            }
        },

        async close(ws) {
            const { userId } = ws.data.query;
            const roomIds = await chatService.getChatRoom(userId);
            for (const room of roomIds) {
                ws.unsubscribe(room.id);
            }
            console.log(`❌ Client disconnected: ${userId}`);
        },
    });
