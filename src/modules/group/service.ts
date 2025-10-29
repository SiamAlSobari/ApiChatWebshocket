import { GroupRepository } from "./repository";

export class GroupService {
    constructor(
        private readonly groupRepo: GroupRepository
    ){}   

    public async createGroup(chatRoomId: string,GroupName: string){ 
        return await this.groupRepo.createGroup(chatRoomId,GroupName);
    }
}