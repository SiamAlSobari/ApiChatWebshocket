// auth.middleware.ts
import { Elysia } from "elysia";
import { Exception } from "../response/exception";
import jwt from "@elysiajs/jwt";
import { SECRET_KEY } from "../constant/secret";

export const authMiddleware = (app: Elysia) =>
    app.use(jwt({
        secret: SECRET_KEY,
        name: "jwt"
    }))
    .derive(async ({ cookie, jwt }) => {
        const token = cookie?.token?.value;
        console.log("token jwt cookie" + token)
        if (!token) {
            throw new Exception("Unauthorized", 401);
        }
        try {
            const payload = await jwt.verify(token as string);
            console.log("payload jwt middleware sedang di uji", payload)
            if (!payload) {
                throw new Exception("Unauthorized", 401);
            }
            return {
                user: payload as { id:string }
            }
        } catch (error) {
            throw new Exception("Unauthorized", 401);
        }
    })
