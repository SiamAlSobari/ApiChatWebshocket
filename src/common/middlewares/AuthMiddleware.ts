import { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";
import { JWT_SECRET } from "../constants/JwtSecret";
import { getCookie } from "hono/cookie";


declare module "hono" {
    interface ContextVariableMap {
        user: { id: string; user_name: string };
    }
}

export const authMiddleware : MiddlewareHandler = async (c, next) => {
    const token = await getCookie(c,"token"); //
    if (!token) throw new HTTPException(401, {message: "token not found"});
    const payload = await verify(token,JWT_SECRET);
    if (!payload) throw new HTTPException(401, {message: "token invalid"});
    c.set("user",payload as {id:string, user_name:string});
    return next();
}