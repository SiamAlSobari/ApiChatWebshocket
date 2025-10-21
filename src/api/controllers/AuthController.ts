import { Hono } from "hono";
import { AuthService } from "../services/AuthService";
import { UserRepository } from "../repositories/UserRepository";
import { zValidator } from "@hono/zod-validator";
import { logInValidation } from "../validations/AuthValidation";
import { setCookie } from "hono/cookie";
import { authMiddleware } from "../../common/middlewares/AuthMiddleware";

//instansi class
const userRepo = new UserRepository();
const authService = new AuthService(userRepo);

export const authController = new Hono();

//handle login
authController.post("/login", zValidator("json", logInValidation), async (c) => {
  const payload = c.req.valid("json");
  const token = await authService.login(payload.user_name, payload.password);
  setCookie(c, "token", token,{
    maxAge: 7 * 24 * 60 * 60, // set 7 hari
    sameSite: "lax",
    path: "/",
    httpOnly: true
  });
  return c.json({ token });
});

authController.get("/session",authMiddleware, async (c) => {
  const user = c.get("user");
  return c.json(user);
})
