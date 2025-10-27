import { t } from "elysia";

export const ContactModel = {
    createContact: t.Object({
        contact_name: t.String({minLength: 3, maxLength: 500}),
        contact_id: t.String({minLength: 3, maxLength: 500}), 
    }),
}