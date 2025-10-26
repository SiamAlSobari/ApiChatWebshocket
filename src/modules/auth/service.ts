import { Exception } from "../../utils/response/exception";
import { AuthRepository } from "./repository";
import {compare} from "bcryptjs"

export class AuthService {
    // Implementasi layanan autentikasi di sini
    constructor(
        private authRepo: AuthRepository
    ) {}

    public async loginUser(email: string, password: string) {
        const user = await this.authRepo.getUserByEmail(email);
        console.log(user)
        if (!user) {
            throw new Exception("User tidak ditemukan", 404);
        }
        const isPasswordValid = compare(password,user.hashed_password)
        if (!isPasswordValid) {
            throw new Exception("Password salah", 401);
        }
        return user
    }
}
