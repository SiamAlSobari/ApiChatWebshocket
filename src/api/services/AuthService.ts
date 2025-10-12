import { UserRepository } from "../repositories/UserRepository";
import * as bcrypt from "bcryptjs";

export class AuthService {
    constructor(
        private readonly userRepo : UserRepository
    ){}


    public async login(userName: string, password: string) {
        const existingUser = await this.userRepo.getUserByUserName(userName);
        if (!existingUser){
            //return 
            return 
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.hash_password) 
        if (!isValidPassword){
            return 
        }

        const payload = {
            user_id: existingUser.id,
            user_name: existingUser.user_name,
            exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
        }

        
    }
}