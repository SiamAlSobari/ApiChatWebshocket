import { db } from "../../common/utils/db"

/**
 * Class untuk repository chat
 */
export class ChatRepository {
    public async getChatOneToOne(senderId: string, receiverId: string){
        return db.chat.findFirst({
            where: {
                type:'ONE_TO_ONE',
                users: {
                    every: {
                        id: {in: [senderId, receiverId]}
                    }
                }
            }
        })
    }

    public async createChat(creatorId: string, type: "ONE_TO_ONE" | "GROUP", participantId: string[], groupName?: string){
        return db.chat.create({
            data: {
                type: type,
                name: type === 'GROUP' ? groupName || 'Group Chat' : null,
                users:{
                    connect:participantId.map(id => ({id}))
                },
                creator:{
                    connect:{id: creatorId}
                },
            },
            include: {
                users: true,
                creator: true
            }
        })
    }
}