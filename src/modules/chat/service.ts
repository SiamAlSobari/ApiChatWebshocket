import { ChatRepository } from "./repository";

export class ChatService {
    constructor(
        private readonly chatRepo: ChatRepository
    ) {}

    async createPrivateChatRoom(userId: string, userIdReceiver: string) {
        const existingChatRoom = await this.chatRepo.getPrivateChatRoom(userId, userIdReceiver);
        if (existingChatRoom) {
            return existingChatRoom;
        }
        return await this.chatRepo.createPrivateChatRoom(userId, userIdReceiver);
    }
}