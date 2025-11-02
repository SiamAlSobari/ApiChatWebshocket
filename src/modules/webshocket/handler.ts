import Elysia, { t } from "elysia";
import { ChatRepository } from "../chat/repository";
import { ChatService } from "../chat/service";

const chatRepo = new ChatRepository();
const chatService = new ChatService(chatRepo);

const onlineUsers = new Map<string, any>();
export const webshocketHandler = new Elysia({ prefix: "/ws" }).ws("/connect", {
    query: t.Object({
        userId: t.String(),
    }),
    async open(ws) {
        const { userId } = ws.data.query;
        const roomIds = await chatService.getChatRoom(userId);
        console.log(`✅ Client connected: ${userId}`);
        const updateDeliveredMessage = await chatService.updateDeliveredMessage(userId);
        onlineUsers.set(userId, ws);
        // Subscribe ke semua room
        for (const room of roomIds) {
            ws.subscribe(room.id);
        }
        ws.send(
            JSON.stringify({
                type: "connected",
                roomIds,
                userId,
            })
        );
        // boardcast user online
        for (const [_, client] of onlineUsers) {
            client.send(
                JSON.stringify({
                    type: "user_online",
                    userId,
                    usersOnline: Array.from(onlineUsers.keys()),
                })
            );
        }

        // boardcast delivered message
        if (updateDeliveredMessage.count > 0) {
            for (const [_, client] of onlineUsers) {
                client.send(
                    JSON.stringify({
                        type: "delivered_message",
                        userId,
                        updatedCount: updateDeliveredMessage.count,
                    })
                );
            }
        }
    },
    async message(ws, raw) {
        try {
            const { userId } = ws.data.query;

            const data = typeof raw === "string" ? JSON.parse(raw) : raw;
            const { text, roomId, type } = data;

            switch (type) {
                case "message":
                    const message = await chatService.createMessage(roomId, text, userId);
                    const outgoingMessage = JSON.stringify({
                        type: type,
                        text: message.text,
                        id: message.id,
                        sender_id: message.sender_id,
                        chat_room_id: message.chat_room_id,
                        createdAt: message.createdAt,
                        statuses: message.statuses,
                    });
                    ws.send(outgoingMessage);
                    ws.publish(roomId, outgoingMessage);
                    console.log("message created dari client", message);
                    break;
                case "read_message":
                    console.log("read message", roomId);
                    break;
                default:
                    break;
            }
        } catch (err) {
            console.error("❌ Error parsing message:", err);
        }
    },

    async close(ws) {
        const { userId } = ws.data.query;
        const roomIds = await chatService.getChatRoom(userId);
        onlineUsers.delete(userId);
        //boardcast user offline
        for (const [_, client] of onlineUsers) {
            client.send(
                JSON.stringify({
                    type: "user_offline",
                    userId,
                    usersOnline: Array.from(onlineUsers.keys()),
                })
            );
        }
        for (const room of roomIds) {
            ws.unsubscribe(room.id);
        }
        console.log(`❌ Client disconnected: ${userId}`);
    },
});
