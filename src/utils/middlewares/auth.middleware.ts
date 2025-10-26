// auth.middleware.ts
import { Elysia } from "elysia";
import { Exception } from "../response/exception";
import jwt from "@elysiajs/jwt";
import { SECRET_KEY } from "../constant/secret";

export const authMiddleware =  async (app: Elysia) =>
    app.use(jwt({
        secret: SECRET_KEY,
        name: "jwt"
    }))
    .derive(({ cookie, jwt }) => {
        const token = cookie?.token?.value;
        if (!token) {
            throw new Exception("Unauthorized", 401);
        }
        try {
            const payload = jwt.verify(token as string);
            if (!payload) {
                throw new Exception("Unauthorized", 401);
            }
            return {
                user: payload
            }
        } catch (error) {
            throw new Exception("Unauthorized", 401);
        }
    })
