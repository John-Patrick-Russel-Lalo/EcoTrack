const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

class SocketClient {
  constructor() {
    this.socket = null;
    this.messageListeners = new Set();
    this.statusListeners = new Set();
    this.status = 'idle';
    this.reconnectTimer = null;
    this.attempts = 0;
  }

  connect() {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    this.setStatus('connecting');
    const socket = new WebSocket(WS_URL);
    this.socket = socket;

    socket.addEventListener('open', () => {
      this.attempts = 0;
      this.setStatus('open');
    });

    socket.addEventListener('message', (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }
      this.messageListeners.forEach((listener) => listener(data));
    });

    socket.addEventListener('close', () => {
      this.setStatus('closed');
      this.scheduleReconnect();
    });

    socket.addEventListener('error', () => {
      this.setStatus('error');
      socket.close();
    });
  }

  scheduleReconnect() {
    if (this.reconnectTimer) return;
    const delay = Math.min(1000 * 2 ** this.attempts, 15000);
    this.attempts += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  send(payload) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
      return true;
    }
    return false;
  }

  onMessage(listener) {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  onStatus(listener) {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => this.statusListeners.delete(listener);
  }

  setStatus(status) {
    this.status = status;
    this.statusListeners.forEach((listener) => listener(status));
  }
}

export const socket = new SocketClient();
export { WS_URL };
