import { AuthRepository } from "./repository";

export class AuthService {
    // Implementasi layanan autentikasi di sini
    constructor(
        private authRepo: AuthRepository
    ) {}
}
