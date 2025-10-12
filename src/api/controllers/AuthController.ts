import { Hono } from "hono";
import { AuthService } from "../services/AuthService";
import { UserRepository } from "../repositories/UserRepository";
import { zValidator } from "@hono/zod-validator";
import { logInValidation } from "../validations/AuthValidation";

//instansi class
const userRepo = new UserRepository();
const authService = new AuthService(userRepo);

export const authController = new Hono();

authController.post("/login", zValidator("json", logInValidation), (c) => {
  const payload = c.req.valid("json");
  return c.text("pong");
});
