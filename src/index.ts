import { Hono } from "hono";
import { websocket } from "hono/bun";
import { wsController } from "./api/webocket/WsController";
import { authController } from "./api/controllers/AuthController";
import { HTTPException } from 'hono/http-exception'
import { contactController } from "./api/controllers/ContactController";
import { chatController } from "./api/controllers/ChatController";


const app = new Hono().basePath("/api");

// Tangani error di sini
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    console.error('Caught HTTPException:', err.message)
    return err.getResponse()
  }

  return c.text('Internal Server Error', 500)
})
//kumpulan route
app.get("/ping", (c) => c.text("pong"));
app.route("/ws", wsController);
app.route("/auth", authController)
app.route("/contacts", contactController);
app.route("/chats", chatController);

// penting: export server config
export default {
  port: 4000,
  fetch: app.fetch,
  websocket,
};
