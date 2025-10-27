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
                    every: {
                        OR: [{ user_id: userId }, { user_id: userIdReceiver }],
                    },
                },
            },
        });
    }
}
