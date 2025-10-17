export class WsManager {
  static clients = new Map<string, WebSocket>(); // simpan per userId

  static addClient(userId: string, ws: WebSocket) {
    this.clients.set(userId, ws);
  }

  static removeClient(userId: string) {
    this.clients.delete(userId);
  }

  static getClient(userId: string) {
    return this.clients.get(userId);
  }
}
