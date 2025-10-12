import { UserRepository } from "../repositories/UserRepository";

export class AuthService {
    constructor(
        private readonly userRepo : UserRepository
    ){}


    login(userName: string, password: string) {
        const existingUser = this.userRepo.getUserByUserName(userName);
        if (!existingUser){
            //return 
        }

        const isValidPassword = await 
    }
}