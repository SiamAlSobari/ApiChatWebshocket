import { Elysia, t } from "elysia";
import { ApiResponseModel } from "./utils/response/model";
import { ApiResponse } from "./utils/response/api";
import { authMiddleware } from "./utils/middlewares/auth.middleware";
import { Auth } from "./modules/auth";

const app = new Elysia({ prefix: "/api" })
  .get("/", () => "Hello Elysia")
  .use(Auth)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
