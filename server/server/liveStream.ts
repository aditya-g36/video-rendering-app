import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import NodeMediaServer from "node-media-server";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function setupLiveStreaming(httpServer: HTTPServer, io: SocketIOServer) {
  const nms = new NodeMediaServer({
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60,
    },
    http: {
      port: 8000,
      allow_origin: "*",
      mediaroot: path.join(__dirname, "media"),
    },
  });

  const fs = require("fs");
  const mediaDir = path.join(__dirname, "media");
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true });
  }

  nms.run();

  nms.on("prePublish", async (id, StreamPath, args) => {
    console.log(
      "[NodeEvent on prePublish]",
      `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`,
    );

    const streamKey = StreamPath.split("/")[2];

    try {
      const updatedStream = await prisma.stream.update({
        where: { streamKey: streamKey },
        data: { status: "live" },
      });

      io.emit("newStream", {
        streamPath: StreamPath,
        streamId: updatedStream.id,
        title: updatedStream.title,
        description: updatedStream.description,
      });
    } catch (error) {
      console.error("Error updating stream status:", error);
    }
  });

  nms.on("donePublish", async (id, StreamPath, args) => {
    console.log(
      "[NodeEvent on donePublish]",
      `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`,
    );

    const streamKey = StreamPath.split("/")[2];

    try {
      // Find the stream
      const stream = await prisma.stream.findUnique({
        where: { streamKey: streamKey },
      });

      if (stream) {
        // Delete the stream from the database
        await prisma.stream.delete({
          where: { id: stream.id },
        });

        io.emit("streamEnded", {
          streamPath: StreamPath,
          streamId: stream.id,
        });

        console.log(`Stream with ID ${stream.id} has been deleted.`);
      } else {
        console.log(`No stream found with key ${streamKey}`);
      }
    } catch (error) {
      console.error("Error deleting stream:", error);
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return nms;
}
