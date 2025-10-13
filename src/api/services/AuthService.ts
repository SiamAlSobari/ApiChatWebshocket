import { UserRepository } from "../repositories/UserRepository";
import * as bcrypt from "bcryptjs";
import { sign } from "hono/jwt";
import { JWT_SECRET } from "../../common/constants/JwtSecret";
import { HTTPException } from 'hono/http-exception'

export class AuthService {
    constructor(
        private readonly userRepo : UserRepository
    ){} 


    //fungsi login dan logic
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