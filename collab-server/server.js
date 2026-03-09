import { createServer } from "y-websocket/server"

createServer({ port: 1234 })

console.log("Yjs WebSocket server running on port 1234")