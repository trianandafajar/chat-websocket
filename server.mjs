import http from "http";
import next from "next";
import { getOrCreateWSS } from "./lib/ws.js";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = 9898;

// Ensure NextAuth uses the correct base URL for callbacks (used by signOut redirects)
process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || `http://localhost:${PORT}`;

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  // 🔥 INIT WEBSOCKET (SATU KALI)
  getOrCreateWSS(server);

  server.listen(PORT, () => {
    console.log(`🚀 Next.js ready on http://localhost:${PORT}`);
    console.log("🔌 WebSocket server initialized");
  });
});
