import { HTTPException } from "hono/http-exception";
import { ChatRepository } from "../repositories/ChatRepository";

export class ChatService {
    constructor(
        private readonly chatRepo : ChatRepository
    ){}
    
  
    public async createChatRoom(creatorId: string, participantId: string[], type: "ONE_TO_ONE" | "GROUP", groupName?: string){
        if (type === "ONE_TO_ONE"){
            if (participantId.length !== 2){
                throw new Error("ONE_TO_ONE chat must have exactly one participant");
            }
            const [userA, userB] = participantId;
            const existingChat = await this.chatRepo.getChatOneToOne(userA, userB);
            if (existingChat){
                return existingChat;
            }
        }

        if (type === "GROUP" && participantId.length < 3){
            throw new HTTPException(400, {message: "GROUP chat must have at least 3 participants"});
        }
        return this.chatRepo.createChat(creatorId, type, participantId, groupName);
    }
}