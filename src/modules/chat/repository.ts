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
                type: true
            }
        });
    }

    public async createMessage(chatRoomId: string, text: string, senderId: string) {
        return await db.message.create({
            data: {
                text: text,
                chat_room_id: chatRoomId,
                sender_id: senderId,
            },
        });
    }
}
