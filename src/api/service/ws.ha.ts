import { WsManager } from "../../common/utils/WsManager";

export const wsHandler = {
  onOpen: (ws: WebSocket) => {
    WsManager.addClient(ws);
    console.log("Client connected");
    ws.send("Welcome! Kamu sudah tersambung ke server 🚀");
  },

  onMessage: (ws: WebSocket, event: MessageEvent) => {
    console.log("Message from client:", event.data);

    // kirim balik ke pengirim
    ws.send(`Kamu mengirim: ${event.data}`);

    // broadcast ke semua client lain (kecuali pengirim)
    for (const client of Array.from(WsManager.clients)) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`User lain mengirim: ${event.data}`);
      }
    }
  },

  onClose: (ws: WebSocket) => {
    WsManager.removeClient(ws);
    console.log("Client disconnected");
  },
};
