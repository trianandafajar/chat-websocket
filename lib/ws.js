import * as WS from "ws";

/**
 * Global WSS instance
 */
let wss = null;

/**
 * Map client -> userId
 */
const clients = new Map();

/**
 * Init or get WSS
 */
export function getOrCreateWSS(server) {
  if (wss || !server) return wss;

  wss = new WS.WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    if (req.url === "/api/ws") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    }
  });

  /**
   * Handle connection
   */
  wss.on("connection", (ws) => {
    console.log("🔌 WS client connected");

    ws.on("message", async (raw) => {
      try {
        const data = JSON.parse(raw.toString());

        /**
         * AUTH / PRESENCE
         * client kirim saat connect:
         * { type: "auth", userId }
         */
        if (data.type === "auth") {
          clients.set(ws, data.userId);

          broadcast({
            type: "presence",
            userId: data.userId,
            online: true,
          });

          return;
        }

        /**
         * HEARTBEAT
         */
        if (data.type === "ping") {
          ws.send(JSON.stringify({ type: "pong", ts: Date.now() }));
          return;
        }

        /**
         * CREATE MESSAGE
         */
        if (data.type === "message") {
          const { sessionId, text } = data;
          const senderId = clients.get(ws);

          if (!sessionId || !text || !senderId) return;

          /**
           * ⬇️ CREATE MESSAGE (CALL API / DB)
           * SESUAIKAN DENGAN BACKEND KAMU
           */
          const res = await fetch("http://localhost:3000/api/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: "", // optional kalau pakai session cookie
            },
            body: JSON.stringify({
              sessionId,
              text,
            }),
          });

          if (!res.ok) return;

          const message = await res.json();

          /**
           * BROADCAST MESSAGE
           */
          broadcast({
            type: "message",
            sessionId,
            message,
          });
        }
      } catch (err) {
        console.error("WS message error", err);
      }
    });

    ws.on("close", () => {
      const userId = clients.get(ws);
      clients.delete(ws);

      if (userId) {
        broadcast({
          type: "presence",
          userId,
          online: false,
        });
      }

      console.log("❌ WS client disconnected");
    });
  });

  console.log("✅ WSS created");
  return wss;
}

/**
 * Broadcast helper
 */
export function broadcast(data) {
  if (!wss) return;

  const payload = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === WS.WebSocket.OPEN) {
      client.send(payload);
    }
  });
}
