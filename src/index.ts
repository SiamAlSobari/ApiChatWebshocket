import { Hono } from "hono";
import { websocket } from "hono/bun";
import { wsController } from "./api/controllers/WsController";


const app = new Hono().basePath("/api");

//kumpulan route
app.get("/ping", (c) => c.text("pong"));
app.route("/ws", wsController);

// penting: export server config
export default {
  port: 4000,
  fetch: app.fetch,
  websocket,
};
