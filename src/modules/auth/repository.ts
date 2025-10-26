import { db } from "../../utils/constant/db";

export class AuthRepository {
    // Implementasi repository autentikasi di sini

    public async getUserByEmail(email: string) {
        return await db.user.findUnique({
            where: { email }
        })
    }
}
