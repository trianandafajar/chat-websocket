import http from "http";
import next from "next";
import { getOrCreateWSS } from "./lib/ws.js";

const dev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 3042;

process.env.NEXTAUTH_URL =
  process.env.NEXTAUTH_URL || `http://localhost:${PORT}`;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  getOrCreateWSS(server);

  server.listen(PORT, () => {
    console.log(`🚀 Next.js ready on http://localhost:${PORT}`);
    console.log("🔌 WebSocket server initialized");
  });
});
