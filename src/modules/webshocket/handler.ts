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
        console.log(`✅ Client connected: ${userId}`);

        // Ambil semua room
        const roomIds = await chatService.getChatRoom(userId);
        const updateDeliveredMessage = await chatService.updateDeliveredMessage(userId);

        // Boardcast user online ke map
        onlineUsers.set(userId, ws);
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

        // Boardcast user online ke semua client
        for (const [_, client] of onlineUsers) {
            client.send(
                JSON.stringify({
                    type: "user_status_online",
                    userId,
                    users: Array.from(onlineUsers.keys()),
                })
            );
        }
        console.log("Client online:" + Array.from(onlineUsers.keys()));

        // Boardcast delivered message
        if (updateDeliveredMessage.count > 0) {
            for (const room of roomIds) {
                ws.publish(
                    room.id,
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
            const { text, roomId, type, messageId } = data;

            switch (type) {
                case "message":
                    const message = await chatService.createMessage(roomId, text, userId);
                    const outgoingMessage = JSON.stringify({
                        type: "message",
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
                    console.log(`📖 User ${userId} reading messages in room ${roomId}`);

                    try {
                        const readMessage = await chatService.updateReadMessage(roomId, userId);

                        // Broadcast ke SEMUA user di room termasuk sender
                        const broadcastData = JSON.stringify({
                            type: "read_message",
                            roomId,
                            readerId: userId,
                            updatedCount: readMessage.count,
                            updatedMessages: readMessage.updatedMessages,
                            timestamp: Date.now(),
                        });

                        // Broadcast ke semua subscribers room
                        ws.publish(roomId, broadcastData);

                        // Juga kirim ke sender untuk konfirmasi
                        ws.send(broadcastData);

                        console.log(
                            `✅ Read message broadcasted to room ${roomId}`,
                            readMessage.count,
                            "messages updated"
                        );
                    } catch (error) {
                        console.error("❌ Error in read_message:", error);
                        ws.send(
                            JSON.stringify({
                                type: "error",
                                message: "Failed to mark messages as read",
                            })
                        );
                    }
                    break;

                default:
                    console.log("Unknown message type:", type);
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

        // Boardcast user offline
        for (const [_, client] of onlineUsers) {
            client.send(
                JSON.stringify({
                    type: "user_status_offline",
                    userId,
                    users: Array.from(onlineUsers.keys()),
                })
            );
        }

        for (const room of roomIds) {
            ws.unsubscribe(room.id);
        }
        console.log(`❌ Client disconnected: ${userId}`);
    },
});
