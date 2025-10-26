// auth.middleware.ts
import { Elysia } from "elysia";
import { Exception } from "../response/exception";

export const authMiddleware = (app: Elysia) =>
    app.derive(({cookie}) => {
        // Middleware logic here
        const token = cookie?.token?.value;
        if (!token) {
            throw new Exception("Unauthorized", 401);
        }
        return {
            user: "AuthenticatedUser"
        }
    })
