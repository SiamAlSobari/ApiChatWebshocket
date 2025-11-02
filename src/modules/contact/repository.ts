import { db } from "../../utils/constant/db";

export class ContactRepository {
    public async createContact(contactName: string, contactId: string, userId: string) {
        return await db.contact.create({
            data: {
                contact_name: contactName,
                contact_id: contactId,
                user_id: userId,
            },
        });
    }

    public async getContacts(userId: string) {
        return await db.contact.findMany({
            where: {
                user_id: userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        profile: true,
                    },
                },
                contact: {
                    select: {
                        id: true,
                        profile: true,
                        chatRooms: true
                    },
                    
                }, 
            },
        });
    }

    public async getContact(userId: string) {
        return await db.contact.findFirst({
            where: {
                contact_id: userId
            },
            include: {
                contact: {
                    select: {
                        id: true,
                        profile: true,
                    },
                }, 
            },
        })
    }
}
