import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

type Quality = "low" | "medium" | "high";

const VideoPlayer: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [quality, setQuality] = useState<Quality>("medium");
  const { filename } = useParams<{ filename: string }>();

  useEffect(() => {
    if (filename) {
      setVideoUrl(
        `http://localhost:5000/api/stream/${filename}?quality=${quality}`
      );
    }
  }, [filename, quality]);

  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuality(e.target.value as Quality);
  };

  return (
    <div className="container mt-5">
      <video src={videoUrl} controls style={{ width: "100%" }}>
        Your browser does not support the video tag.
      </video>
      <div className="mt-3">
        <label htmlFor="quality" className="me-2">
          Quality:
        </label>
        <select
          id="quality"
          value={quality}
          onChange={handleQualityChange}
          className="form-select"
          style={{ width: "auto", display: "inline-block" }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
  );
};

export default VideoPlayer;
