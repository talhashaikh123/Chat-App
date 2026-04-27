import express from "express";
import http from "http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./src/lib/db.js";
import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js";
import { initSocket } from "./src/lib/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-app-cn76.vercel.app", // ← REPLACE with your real Vercel URL
];

// ✅ Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ✅ CORS (final)
app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin || // for Postman / server-to-server
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") // allow preview deployments
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Socket
initSocket(server);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//   app.get("*", (_, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
//   });
// }

// ✅ Start server
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log("Server running on port:", PORT);
    });
  } catch (error) {
    console.log("Failed to start server:", error.message);
  }
};

startServer();