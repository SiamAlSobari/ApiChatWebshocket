import { Elysia, t } from "elysia";
import { ApiResponseModel } from "./utils/response/model";
import { ApiResponse } from "./utils/response/api";

const app = new Elysia({ prefix: "/api" })
  .get("/", () => "Hello Elysia")
  .post(
    "/",
    () => {
      return new ApiResponse({ hello: "world" }, "Request successful", 200);
    },
    {
      response: ApiResponseModel
    }
  )
  .listen(3000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
