import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import flvjs from "flv.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

const LivePlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { filename } = useParams<{ filename: string }>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let flvPlayer: flvjs.Player | null = null;

    if (filename && flvjs.isSupported()) {
      flvPlayer = flvjs.createPlayer({
        type: "flv",
        url: `http://localhost:8000/live/${filename}.flv`,
      });
      if (videoRef.current) {
        flvPlayer.attachMediaElement(videoRef.current);
        flvPlayer.load();
        flvPlayer.play();
        setIsPlaying(true);
      }
    }

    return () => {
      if (flvPlayer) {
        flvPlayer.destroy();
      }
    };
  }, [filename]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-5">
      <div className="relative w-full max-w-2xl">
        <video
          ref={videoRef}
          className="w-full rounded-lg shadow-lg"
          controls
        ></video>
        <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
          LIVE
        </div>
      </div>
      <div className="flex mt-4 space-x-4">
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className={`bg-white border-none p-3 rounded-full shadow-md transition-colors ${
            isPlaying ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          <i className="fas fa-play text-lg text-gray-800"></i>
        </button>
        <button
          onClick={handlePause}
          disabled={!isPlaying}
          className={`bg-white border-none p-3 rounded-full shadow-md transition-colors ${
            !isPlaying ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          <i className="fas fa-pause text-lg text-gray-800"></i>
        </button>
      </div>
    </div>
  );
};

export default LivePlayer;
