import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes";
import morgan from "morgan";
import { setupLiveStreaming } from "./liveStream";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", routes);

setupLiveStreaming(server, io);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`RTMP server is running on rtmp://localhost:1935`);
  console.log(`HTTP-FLV server is running on http://localhost:8000`);
});
