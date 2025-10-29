import { db } from "../../utils/constant/db";

export class GroupRepository {
    public async createGroup(chatRoomId: string,GroupName: string){ 
        return await db.group.create({
            data:{
                chat_room_id: chatRoomId,
                group_name: GroupName
            }
        })
    }
}