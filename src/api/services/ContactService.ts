import { ContactRepository } from "../repositories/ContactRepository";

export class ContactService {
    constructor(private contactRepo: ContactRepository) {}

    public async createContact(userId: string, contactId: string, contactName?: string) {
        return this.contactRepo.createContact(userId, contactId, contactName);
    }
}