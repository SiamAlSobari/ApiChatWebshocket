import z from "zod";

export const logInValidation = z.object({
    user_name: z.string().min(3),
    password: z.string().min(5),
})