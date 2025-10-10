import { Hono } from "hono";
import { websocket } from "hono/bun";
import { wsController } from "./api/controllers/ws.co";

const app = new Hono().basePath("/api");

// route lain (misal samehadaku)

app.get("/ping", (c) => c.text("pong"));
app.route("/ws", wsController);

// penting: export server config
export default {
  port: 4000,
  fetch: app.fetch,
  websocket,
};
