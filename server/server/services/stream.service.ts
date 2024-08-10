import fs from "fs/promises";
import path from "path";
import { PrismaClient, Prisma } from "@prisma/client";
import express from "express";
import { v4 as uuidv4 } from "uuid";

import { SvideoFindMany } from "../dao/video";
import { SstreamFindMnay, createstream } from "../dao/stream";

const livestream = express.Router();

livestream.post("/create-stream", async (req, res) => {
  const { userId, title, description } = req.body;
  console.log(req.body);
  if (!userId || !title || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Generate a unique stream key
    const streamKey = uuidv4();

    // Generate a unique URL for the stream
    const streamUrl = `/live/${streamKey}`;

    // Create a new Stream entry in the database
    const newStream = await createstream(
      parseInt(userId),
      title,
      description,
      streamKey,
      streamUrl
    );

    res.status(201).json({
      message: "Stream created successfully",
      streamKey: newStream.streamKey,
      streamUrl: newStream.url,
      rtmpUrl: `rtmp://localhost:1935/live`,
      stream: newStream,
    });
  } catch (error) {
    console.error("Error creating stream:", error);
    res.status(500).json({ error: "Failed to create stream" });
  }
});

export { livestream };




const prisma = new PrismaClient();
const QueryMode = Prisma.QueryMode;

class VideoService {
  static async searchVideosAndStreams(searchTerm: string) {
    const searchCondition = {
      OR: [
        { title: { contains: searchTerm, mode: QueryMode.insensitive } },
        { description: { contains: searchTerm, mode: QueryMode.insensitive } },
      ],
    };

    const videos = await SvideoFindMany(searchTerm);
    const streams = await SstreamFindMnay(searchTerm);

    const formatResult = async (item: any, isLiveStream: boolean) => {
      let thumbnailData = null;
      if (!isLiveStream && item.thumbnail) {
        try {
          const thumbnailPath = path.join(
            process.cwd(),
            "uploads",
            path.basename(item.thumbnail)
          );
          thumbnailData = await fs.readFile(thumbnailPath, {
            encoding: "base64",
          });
        } catch (error) {
          console.error(`Error reading thumbnail for video ${item.id}:`, error);
        }
      }

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        url: item.url,
        filename: isLiveStream ? null : item.filename,
        thumbnail: thumbnailData
          ? `data:image/jpeg;base64,${thumbnailData}`
          : null,
        username: item.user.username,
        profilePicture:
          item.user.profile?.profilePicture || "default_profile_picture_url",
        isLiveStream,
        streamKey: isLiveStream ? item.streamKey : null,
      };
    };

    const results = await Promise.all([
      ...videos.map((video) => formatResult(video, false)),
      ...streams.map((stream) => formatResult(stream, true)),
    ]);

    return results.sort(
      (a, b) => Number(b.isLiveStream) - Number(a.isLiveStream)
    );
  }
}

export { VideoService };

