import { UserRepository } from "../repositories/UserRepository";
import * as bcrypt from "bcryptjs";
import { sign } from "hono/jwt";
import { JWT_SECRET } from "../../common/constants/JwtSecret";
import { HTTPException } from 'hono/http-exception'

/**
 * Class untuk service auth
 */
export class AuthService {
    constructor(
        private readonly userRepo : UserRepository
    ){} 


    /**
     * Fungsi untuk login 
     * 
     * @param userName  - username yang diinput
     * @param password  - password yang diinput
     * @returns {Promise<string>} - token dari jwt
     * @throws {HTTPException} - throw exception jika user tidak ditemukan
     * @throws {HTTPException} - throw exception jika password salah
     */
    public async login(userName: string, password: string) {
        const existingUser = await this.userRepo.getUserByUserName(userName);
        if (!existingUser){ //cek user jika tidak ada
            throw new HTTPException(401, {message: "user tidak ditemukan"});
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.hash_password) 
        if (!isValidPassword){ //cek password antara input dan di db
            throw new HTTPException(401, {message: "password salah"});
        }

        //payload untuk jwt
        const payload = {
            user_id: existingUser.id,
            user_name: existingUser.user_name,
            exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
        }

        return await sign(payload, JWT_SECRET);
    }
}