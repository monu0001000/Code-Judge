import { WebSocketServer } from "ws"
import { setupWSConnection } from "y-websocket/bin/utils.js"
import http from "http"

const server = http.createServer()
const wss = new WebSocketServer({ server })

wss.on("connection", (conn, req) => {
  setupWSConnection(conn, req)
})

const PORT = 1234

server.listen(PORT, () => {
  console.log(`Yjs WebSocket server running on port ${PORT}`)
})