import { ChatRepository } from "./repository";

export class ChatService {
    constructor(
        private readonly chatRepo: ChatRepository
    ) {}

    public async createPrivateChatRoom(userId: string, userIdReceiver: string) {
        const existingChatRoom = await this.chatRepo.getPrivateChatRoom(userId, userIdReceiver);
        if (existingChatRoom) {
            return existingChatRoom;
        }
        return await this.chatRepo.createPrivateChatRoom(userId, userIdReceiver);
    }

    public async getChatRoom(userId: string) {
        return await this.chatRepo.getChatRoom(userId);
    }

    public async createMessage(chatRoomId: string, text: string, senderId: string) {
        return await this.chatRepo.createMessage(chatRoomId, text,senderId);
    }

    public async getMessages(chatRoomId: string) {
        return await this.chatRepo.getMessages(chatRoomId);
    }

    public async updateReadMessage(chatRoomId: string, readerId: string) {
        return await this.chatRepo.updateReadMessage(chatRoomId, readerId);
    }

    public async updateDeliveredMessage(readerId: string) {
        return await this.chatRepo.updateDeliveredMessage(readerId);
    }
}