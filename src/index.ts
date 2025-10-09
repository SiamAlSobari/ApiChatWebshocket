import { Hono } from "hono";
import { upgradeWebSocket, websocket } from "hono/bun";

const app = new Hono().basePath("/api");

// route lain (misal samehadaku)

// penting: export server config
export default {
  port: 4000,
  fetch: app.fetch,
  websocket,
};
