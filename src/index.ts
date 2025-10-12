import { Hono } from "hono";
import { websocket } from "hono/bun";
import { wsController } from "./api/controllers/WsController";
import { authController } from "./api/controllers/AuthController";
import { HttpException } from "./common/utils/HttpException";

const app = new Hono().basePath("/api");
// error handler
app.onError((err,c)=>{
  if (err instanceof HttpException){
    return c.json({success: false, message: err.message}, {status: err.status as 400});
  }
  return c.json({success: false, message: err.message}, {status: 500});
}) //handle error exception



//kumpulan route
app.get("/ping", (c) => c.text("pong"));
app.route("/ws", wsController);
app.route("/auth", authController)

// penting: export server config
export default {
  port: 4000,
  fetch: app.fetch,
  websocket,
};
