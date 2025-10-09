import { Hono } from "hono";
import { SamehadakuRoute } from "./routes/SamehadakuRoute";
import { upgradeWebSocket, websocket } from "hono/bun";

const app = new Hono().basePath("/api");

// route lain (misal samehadaku)
app.route("anime/samehadaku", SamehadakuRoute);

// penting: export server config
export default {
  port: 4000,
  fetch: app.fetch,
  websocket,
};
