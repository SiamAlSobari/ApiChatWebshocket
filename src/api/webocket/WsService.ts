import { WsManager } from "../../common/utils/WsManager";

export const wsHandler = {
  onOpen: (ws: WebSocket) => {
    console.log("Client connected, menunggu userId...");
    ws.send(
      JSON.stringify({ type: "info", text: "Kirim userId untuk identifikasi" })
    );
  },

  onMessage: (ws: WebSocket, event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);

      // 1️⃣ Pertama kali: identifikasi user
      if (data.type === "init" && data.userId) {
        WsManager.addClient(data.userId, ws);
        ws.send(
          JSON.stringify({
            type: "info",
            text: "Kamu terdaftar sebagai user " + data.userId,
          })
        );
        return;
      }

      // 2️⃣ Kirim pesan ke user tertentu
      if (data.type === "message" && data.to && data.text) {
        const target = WsManager.getClient(data.to);
        if (target && target.readyState === WebSocket.OPEN) {
          target.send(
            JSON.stringify({
              from: data.from,
              text: data.text,
            })
          );
        } else {
          ws.send(JSON.stringify({ type: "error", text: "User tidak online" }));
        }
      }
    } catch (err) {
      console.error("Invalid message:", event.data);
    }
  },

  onClose: (ws: WebSocket) => {
    // hapus user yang disconnect
    for (const userId in WsManager.clients) {
      const client = WsManager.clients.get(userId);
      if (client === ws) WsManager.removeClient(userId);
    }
    console.log("Client disconnected");
  },
};
