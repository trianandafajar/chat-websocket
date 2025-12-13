import * as WS from "ws";
import { prisma } from "./prisma.js";

/**
 * =========================
 * CONFIG
 * =========================
 */
const DEBUG = true;

/**
 * =========================
 * GLOBAL STATE
 * =========================
 */
let wss = null;

/**
 * Map WebSocket -> userId
 */
const clients = new Map();

/**
 * =========================
 * UTILS
 * =========================
 */
const log = (...args) => {
  if (DEBUG) console.log("🟢 [WS]", ...args);
};

const error = (...args) => {
  console.error("🔴 [WS]", ...args);
};

const isObjectId = (id) =>
  typeof id === "string" && id.length === 24;

/**
 * =========================
 * INIT / GET WSS
 * =========================
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
   * =========================
   * CONNECTION
   * =========================
   */
  wss.on("connection", (ws) => {
    log("Client connected");

    ws.on("message", async (raw) => {
      try {
        const data = JSON.parse(raw.toString());

        /**
         * =========================
         * AUTH
         * =========================
         */
        if (data.type === "auth") {
          if (!isObjectId(data.userId)) {
            error("Invalid auth userId", data.userId);
            ws.close();
            return;
          }

          clients.set(ws, data.userId);
          log("Authenticated:", data.userId);

          broadcast({
            type: "presence",
            userId: data.userId,
            online: true,
          });

          return;
        }

        /**
         * =========================
         * HEARTBEAT
         * =========================
         */
        if (data.type === "ping") {
          ws.send(JSON.stringify({ type: "pong", ts: Date.now() }));
          return;
        }

        /**
         * =========================
         * CREATE MESSAGE
         * =========================
         */
        if (data.type === "message") {
          const { sessionId, text } = data;
          const senderId = clients.get(ws);

          log("Incoming message", {
            sessionId,
            senderId,
            text,
          });

          if (!senderId) {
            error("Message before auth");
            return;
          }

          if (!isObjectId(sessionId) || !text?.trim()) {
            error("Invalid message payload", data);
            return;
          }

          /**
           * 💾 SAVE MESSAGE
           */
          const message = await prisma.message.create({
            data: {
              sessionId,
              senderId,
              text: text.trim(),
            },
          });

          /**
           * 🔄 UPDATE SESSION
           */
          await prisma.session.update({
            where: { id: sessionId },
            data: {
              lastMessage: message.text,
              lastMessageAt: message.createdAt,
            },
          });

          log("Message saved:", message.id);

          /**
           * 📡 BROADCAST MESSAGE
           */
          broadcast({
            type: "message",
            sessionId,
            message,
          });

          return;
        }

        log("Unknown WS type:", data.type);
      } catch (err) {
        error("WS message error", err);
      }
    });

    /**
     * =========================
     * DISCONNECT
     * =========================
     */
    ws.on("close", () => {
      const userId = clients.get(ws);
      clients.delete(ws);

      if (userId) {
        log("Disconnected:", userId);

        broadcast({
          type: "presence",
          userId,
          online: false,
        });
      }
    });
  });

  log("WebSocket Server CREATED");
  return wss;
}

/**
 * =========================
 * BROADCAST
 * =========================
 */
function broadcast(data) {
  if (!wss) return;

  const payload = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === WS.WebSocket.OPEN) {
      client.send(payload);
    }
  });

  log("Broadcast:", data.type);
}
