const { createServer } = require("http");
const { WebSocketServer } = require("ws");
const { setupWSConnection } = require("y-websocket");

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  setupWSConnection(ws, req);
});

const PORT = 1234;

server.listen(PORT, () => {
  console.log(`Yjs WebSocket server running on port ${PORT}`);
});