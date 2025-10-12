export class WsManager {
  public static clients = new Set<WebSocket>();

  static addClient(ws: WebSocket) {
    this.clients.add(ws);
  }

  static removeClient(ws: WebSocket) {
    this.clients.delete(ws);
  }

  static boardcast(message: string) {
    for (const client of Array.from(this.clients)) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
}
