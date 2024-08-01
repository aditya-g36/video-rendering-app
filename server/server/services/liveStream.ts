import express from "express";
import { v4 as uuidv4 } from "uuid";
import { createstream } from "../dao/stream.dao";

const router = express.Router();

router.post("/create-stream", async (req, res) => {
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

export default router;
