import { Hono } from "hono";
import { upgradeWebSocket } from "hono/bun";
import { wsHandler } from "./WsService";

export const wsController = new Hono();

/// route test biasa
wsController.get("/", (c) => c.text("pong"));

// route WebSocket — harus beda path!
wsController.get(
  "/connect",
  upgradeWebSocket(() => ({
    onOpen: (_evt, ctx) => wsHandler.onOpen(ctx.raw),
    onMessage: (evt, ctx) => wsHandler.onMessage(ctx.raw, evt),
    onClose: (_evt, ctx) => wsHandler.onClose(ctx.raw),
  })),
);
