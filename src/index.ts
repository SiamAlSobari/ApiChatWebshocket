import { Elysia, t } from "elysia";
import { Exception } from "./utils/exception";

const app = new Elysia({ prefix: "/api" })
  .get("/", () => "Hello Elysia")
  .post("/", () => {
    throw new Exception("Custom exception occurred", 400);
  })
  .listen(3000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
