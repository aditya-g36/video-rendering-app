import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import { spawn } from "child_process";
import { PrismaClient } from "@prisma/client";
import { findFirst, findMany, createvideo } from "../dao/video";

const videorouter = express.Router();
const prisma = new PrismaClient();

const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Endpoint to upload a video and thumbnail
videorouter.post(
  "/upload",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!files || !files["video"] || !files["thumbnail"]) {
        return res
          .status(400)
          .json({ error: "Video and thumbnail are required" });
      }

      const videoFile = files["video"][0];
      const thumbnailFile = files["thumbnail"][0];
      const { title, description, userId } = req.body;

      if (!title || !description || !userId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Save video information to the database
      const video = await createvideo(
        title,
        videoFile.filename,
        videoFile.originalname,
        description,
        `/uploads/${videoFile.filename}`,
        `/uploads/${thumbnailFile.filename}`,
        parseInt(userId)
      );

      res.status(201).json({ message: "Video uploaded successfully", video });
    } catch (error) {
      console.error("Error uploading video:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Update the random videos endpoint
videorouter.get("/random/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch 20 random videos from the database
    const randomVideos = await findMany();

    // Shuffle the videos array
    const shuffledVideos = randomVideos.sort(() => Math.random() - 0.5);

    // Map the videos to the desired format and read thumbnail files
    const formattedVideos = await Promise.all(
      shuffledVideos.map(async (video) => {
        let thumbnailData = null;
        try {
          const thumbnailPath = path.join(
            uploadsDir,
            path.basename(video.thumbnail)
          );
          thumbnailData = await fs.promises.readFile(thumbnailPath, {
            encoding: "base64",
          });
        } catch (error) {
          console.error(
            `Error reading thumbnail for video ${video.id}:`,
            error
          );
        }

        return {
          id: video.id,
          title: video.title,
          thumbnail: thumbnailData
            ? `data:image/jpeg;base64,${thumbnailData}`
            : null,
          profilePicture:
            video.user.profile?.profilePicture ||
            "https://imgs.search.brave.com/5cAi-jXDh0PdCGuh2vvsggwMUWvGlmTFmbCQ7jYJ9OI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc",
          username: video.user.username,
          filename: video.filename,
          description: video.description,
        };
      })
    );

    res.json(formattedVideos);
  } catch (error) {
    console.error("Error fetching random videos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { videorouter };




const streamRouter = express.Router();



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

export { streamRouter };
