import { ContactRepository } from "./repository";

export class ContactSevice {
    constructor(
        private readonly contactRepo: ContactRepository
    ) {}

    public async createContact(contactName: string, contactId:string, userId: string) {
        return await this.contactRepo.createContact(contactName, contactId, userId);
    }
}