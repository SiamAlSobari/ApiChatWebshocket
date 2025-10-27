import { Elysia, t } from "elysia";
import { Auth } from "./modules/auth";
import openapi from "@elysiajs/openapi";

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
    app.use(Auth)
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
