import { db } from "../../utils/constant/db";

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
        });
    }
}
