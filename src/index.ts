import { Elysia, t } from "elysia";
import openapi from "@elysiajs/openapi";
import cors from "@elysiajs/cors";
import { authController } from "./modules/auth";
import { chatController } from "./modules/chat";
import { contactController } from "./modules/contact";
import { webshocketHandler } from "./modules/webshocket/handler";

const clients: any[] = []; // Simpan semua koneksi aktif
const app = new Elysia()
  .use(openapi({
    path: "/docs",
    documentation:{
      info: {
        title: "Chat API",
        version: "1.0.0"
      }
    }
  }))
  .use(cors({
    credentials: true,
    origin: ["http://localhost:5173","http://localhost:4173"],
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    }))
  .get("/", () => "Hello Elysia")
  //   .ws("/chat", {
  //   open(ws) {
  //     clients.push(ws);
  //     console.log("✅ Client connected, total:", clients.length);
  //     ws.send("Welcome to Elysia Chat 💬");
  //   },

  //   message(ws, msg) {
  //     console.log("📩 Message:", msg);

  //     // Kirim pesan ke semua client (termasuk pengirim)
  //     for (const client of clients) {
  //       if (client.readyState === 1) {
  //         client.send(String(msg));
  //       }
  //     }
  //   },

  //   close(ws) {
  //     // Hapus koneksi dari daftar
  //     const index = clients.indexOf(ws);
  //     if (index !== -1) clients.splice(index, 1);
  //     console.log("❌ Client disconnected, total:", clients.length);
  //   },
  // })
  .group("/api", (app) =>
    app.use(authController)
    .use(chatController)
    .use(contactController)
    .use(webshocketHandler)
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
