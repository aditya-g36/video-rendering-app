import express, { Request, Response } from "express";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { findFirst } from "../dao/video.dao";

const streamRouter = express.Router();
const prisma = new PrismaClient();
const uploadsDir = path.join(__dirname, "../../uploads");

const qualityPresets = {
  low: { videoBitrate: "500k", audioBitrate: "64k", resolution: "640x360" },
  medium: {
    videoBitrate: "1000k",
    audioBitrate: "128k",
    resolution: "1280x720",
  },
  high: {
    videoBitrate: "2000k",
    audioBitrate: "192k",
    resolution: "1920x1080",
  },
} as const;

type QualityPreset = keyof typeof qualityPresets;

streamRouter.get("/:filename", async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const requestedQuality = req.query.quality as string;
    const startTime = req.query.start
      ? parseFloat(req.query.start as string)
      : 0;

    let quality: QualityPreset = "medium";
    if (requestedQuality in qualityPresets) {
      quality = requestedQuality as QualityPreset;
    }

    const video = await findFirst(filename);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const filePath = path.join(uploadsDir, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Video file not found" });
    }

    const qualitySettings = qualityPresets[quality];

    res.writeHead(200, {
      "Content-Type": "video/mp4",
      "Transfer-Encoding": "chunked",
    });

    const ffmpeg = spawn("ffmpeg", [
      "-ss",
      startTime.toString(),
      "-i",
      filePath,
      "-c:v",
      "libx264",
      "-b:v",
      qualitySettings.videoBitrate,
      "-maxrate",
      qualitySettings.videoBitrate,
      "-bufsize",
      `${parseInt(qualitySettings.videoBitrate) * 2}k`,
      "-vf",
      `scale=${qualitySettings.resolution}`,
      "-preset",
      "ultrafast",
      "-tune",
      "zerolatency",
      "-c:a",
      "aac",
      "-b:a",
      qualitySettings.audioBitrate,
      "-f",
      "mp4",
      "-movflags",
      "frag_keyframe+empty_moov+default_base_moof",
      "pipe:1",
    ]);

    ffmpeg.stdout.pipe(res);

    ffmpeg.stderr.on("data", (data) => {
      console.error(`FFmpeg stderr: ${data}`);
    });

    ffmpeg.on("error", (error) => {
      console.error("FFmpeg error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal server error" });
      }
    });

    req.on("close", () => {
      ffmpeg.kill("SIGKILL");
    });
  } catch (error) {
    console.error("Error streaming video:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default streamRouter;
