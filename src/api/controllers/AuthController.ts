import { Hono } from "hono";
import { AuthService } from "../services/AuthService";
import { UserRepository } from "../repositories/UserRepository";
import { zValidator } from "@hono/zod-validator";
import { logInValidation } from "../validations/AuthValidation";
import { HTTPException } from 'hono/http-exception'


//instansi class
const userRepo = new UserRepository();
const authService = new AuthService(userRepo);

export const authController = new Hono();

//handle login
authController.post("/login", zValidator("json", logInValidation), async (c) => {
  const payload = c.req.valid("json");
  const token = await authService.login(payload.user_name, payload.password);
  return c.json({ token });
});
