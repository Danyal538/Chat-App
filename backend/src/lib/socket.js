import { Server } from "socket.io"
import http from "http"
import express from "express"

const app = express();
const server = http.createServer(app);

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
})

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    const userId = socket.handshake.query.userId;

    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // io emit used to send events to all connected clients 

    socket.on("disconnect", (socket) => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    socket.on("setup", (userId) => {
        socket.join(userId);
        // console.log(`User joined room: ${userId}`);
    });

    socket.on("typing", ({ from, to }) => {
        // console.log(`Typing event received: ${from} -> ${to}`);
        io.to(to).emit("typing", { from, to });  // <-- this sends the event only to the `to` user's room
    });

    // other handlers ...
});

export { io, server, app };