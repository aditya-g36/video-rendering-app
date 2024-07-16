import { Request, Response } from "express";
import VideoService from "./videoService";
import express from "express";

const searchrouter = express.Router();

searchrouter.get("/searchquery/:squery", async (req, res) => {
  const { squery } = req.params;
  console.log(squery);

  if (typeof squery !== "string" || !squery) {
    return res.status(400).json({ error: "Invalid search query" });
  }

  try {
    const results = await VideoService.searchVideosAndStreams(squery);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error in search query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default searchrouter;
