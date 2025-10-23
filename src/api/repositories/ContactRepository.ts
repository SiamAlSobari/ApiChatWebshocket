import { db } from "../../common/utils/db";

export class ContactRepository {
    public async createContact(userId: string, contactId: string, contactName?: string) {
        return db.contact.create({
            data: {
                user_id: userId,
                contact_id: contactId,
                contact_name: contactName || null,
            },
        });
    }
}