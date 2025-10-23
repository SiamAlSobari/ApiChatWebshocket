import z from "zod";

export const createContactValidation = z.object({
    contact_name: z.string().min(3).optional(),
    contact_id: z.string(),
})