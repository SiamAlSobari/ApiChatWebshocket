import { db } from "../../utils/constant/db";

export interface MessageStore {
    text: string;
    id: string;
    type?: string;
    sender_id: string;
    chat_room_id: string;
    createdAt: string;
    statuses: MessageStatus[];
}

interface MessageStatus {
    id: string;
    status: "SENT" | "DELIVERED" | "READ";
    message_id: string;
    user_id: string;
    createdAt: string;
}

export class ChatRepository {
    public async createPrivateChatRoom(userId: string, userIdReceiver: string) {
        return await db.chatRoom.create({
            data: {
                type: "PRIVATE",
                members: {
                    create: [{ user_id: userId }, { user_id: userIdReceiver }],
                },
            },
        });
    }

    public async getPrivateChatRoom(userId: string, userIdReceiver: string) {
        return await db.chatRoom.findFirst({
            where: {
                type: "PRIVATE",
                members: {
                    some: {
                        OR: [{ user_id: userId }, { user_id: userIdReceiver }],
                    },
                },
            },
        });
    }

    public async getChatRoom(userId: string) {
        return await db.chatRoom.findMany({
            where: {
                members: {
                    some: {
                        user_id: userId,
                    },
                },
            },
            select: {
                id: true,
                type: true,
            },
        });
    }

    public async createMessage(chatRoomId: string, text: string, senderId: string) {
        const members = await db.chatRoomMember.findMany({
            where: { chat_room_id: chatRoomId },
            select: { user_id: true },
        });
        return await db.message.create({
            data: {
                text: text,
                chat_room_id: chatRoomId,
                sender_id: senderId,
                statuses: {
                    create: members
                        .filter((m) => m.user_id !== senderId)
                        .map((m) => ({ receiver_id: m.user_id })),
                },
            },
            include: {
                statuses: true,
            },
        });
    }

    public async getMessages(chatRoomId: string) {
        return await db.message.findMany({
            where: {
                chat_room_id: chatRoomId,
            },
            orderBy: {
                createdAt: "asc",
            },
            include: {
                statuses: true,
            },
        });
    }

    public async updateReadMessage(chatRoomId: string, readerId: string) {
        try {
            console.log(
                `📖 REAL-TIME: Marking messages as READ in room ${chatRoomId} for user ${readerId}`
            );

            // 1. Update status messages
            const updateResult = await db.messageStatus.updateMany({
                where: {
                    message: {
                        chat_room_id: chatRoomId,
                    },
                    receiver_id: readerId,
                    status: {
                        in: ["SENT", "DELIVERED"],
                    },
                },
                data: {
                    status: "READ",
                },
            });

            // 2. Ambil semua messages di room untuk real-time update
            const updatedMessages = await db.message.findMany({
                where: {
                    chat_room_id: chatRoomId,
                },
                include: {
                    statuses: true,
                },
                orderBy: {
                    createdAt: "asc",
                },
            });

            // 3. Format untuk frontend
            const formattedMessages: MessageStore[] = updatedMessages.map((msg) => ({
                id: msg.id,
                text: msg.text || "",
                sender_id: msg.sender_id,
                chat_room_id: msg.chat_room_id,
                createdAt: msg.createdAt.toISOString(),
                statuses: msg.statuses.map((status) => ({
                    id: status.id,
                    status: status.status as "SENT" | "DELIVERED" | "READ",
                    message_id: status.message_id,
                    user_id: status.receiver_id,
                    createdAt: status.createdAt.toISOString(),
                })),
            }));

            console.log(`✅ REAL-TIME: Updated ${updateResult.count} messages to READ`);

            return {
                count: updateResult.count,
                updatedMessages: formattedMessages, // Kirim semua messages yang sudah di-update
                readerId,
                roomId: chatRoomId,
            };
        } catch (error) {
            console.error("❌ Error updating read messages:", error);
            throw error;
        }
    }
    public async getAllMessages(userId: string) {
        return await db.message.findMany({
            where: {
                OR: [
                    {
                        sender_id: userId, // pesan yang saya kirim
                    },
                    {
                        statuses: {
                            some: {
                                receiver_id: userId, // pesan yang saya terima
                            },
                        },
                    },
                ],
            },
            include: {
                statuses: true, // supaya status setiap penerima ikut terbawa
            },
            orderBy: {
                createdAt: "asc", // urut dari lama ke baru
            },
        });
    }

    public async updateDeliveredMessage(readerId: string) {
        const chatRooms = await db.chatRoom.findMany({
            where: {
                members: {
                    some: {
                        user_id: readerId,
                    },
                },
            },
            select: {
                id: true,
            },
        });

        const messages = await db.message.findMany({
            where: {
                chat_room_id: {
                    in: chatRooms.map((c) => c.id),
                },
                statuses: {
                    some: {
                        status: "SENT",
                    },
                },
            },
            select: {
                id: true,
            },
        });

        return await db.messageStatus.updateMany({
            where: {
                message_id: {
                    in: messages.map((m) => m.id),
                },
                receiver_id: readerId,
                status: "SENT",
            },
            data: {
                status: "DELIVERED",
            },
        });
    }
}
