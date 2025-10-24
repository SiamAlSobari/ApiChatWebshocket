import { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";
import { JWT_SECRET } from "../constants/JwtSecret";
import { getCookie } from "hono/cookie";



declare module "hono" {
    interface ContextVariableMap {
        user: { user_id: string; user_name: string };
    }
}


/**
 * Middleware untuk memverifikasi autentikasi pengguna melalui token JWT.
 * 
 * - Mengecek apakah cookie `token` tersedia.
 * - Memverifikasi token menggunakan `JWT_SECRET`.
 * - Jika valid, payload token disimpan ke context (`c.set("user", payload)`).
 * - Jika tidak valid atau token tidak ada, lempar `HTTPException`.
 * 
 * @param {Context} c - Context dari request (berisi cookie dan data request).
 * @param {Function} next - Fungsi untuk meneruskan eksekusi ke middleware berikutnya.
 * @returns {Promise<void>} - Tidak mengembalikan nilai, hanya melanjutkan request ke middleware berikutnya.
 * @throws {HTTPException} - Jika token tidak ditemukan (`token not found`) atau token tidak valid (`token invalid`).
 */
export const authMiddleware: MiddlewareHandler = async (c, next) => {
	const token = await getCookie(c, "token");
	if (!token) throw new HTTPException(401, { message: "token not found" });

	const payload = await verify(token, JWT_SECRET);
	if (!payload) throw new HTTPException(401, { message: "token invalid" });

	c.set("user", payload as { user_id: string, user_name: string });
	return next();
};
