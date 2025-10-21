import { ChatRepository } from "../repositories/ChatRepository";

export class ChatService {
    constructor(
        private readonly chatRepo : ChatRepository
    ){}
}