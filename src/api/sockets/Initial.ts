import * as http from "http";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { Server } from "socket.io";
import { authController } from "../controllers/AuthController";

const app = new Hono().basePath("/api");

app.get("/ping", (c) => c.text("pong"));
app.route("/auth", authController);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    console.error("Caught HTTPException:", err.message);
    return err.getResponse();
  }
  return c.text("Internal Server Error", 500);
});

const server = http.createServer(app.fetch as any);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/api/ws/connect",
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);
  socket.on("message", (msg) => {
    console.log("📨", msg);
    socket.emit("reply", `Echo: ${msg}`);
  });
});

server.listen(4000, () => {
  console.log("🚀 Server running on http://localhost:4000");
});
