import { Hono } from "hono";
import { AuthService } from "../service/AuthService";
import { UserRepository } from "../repositories/UserRepository";

//instansi class
const userRepo = new UserRepository();
const authService = new AuthService(userRepo);

export const AuthController = new Hono()

