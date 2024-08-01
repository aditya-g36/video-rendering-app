import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import flvjs from "flv.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import VideoDescription from "./Description";
import { useLocation } from "react-router-dom";

const LivePlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const flvPlayerRef = useRef<flvjs.Player | null>(null);
  const { filename } = useParams<{ filename: string }>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const location = useLocation();
  const videoData = location.state?.videoData;

  useEffect(() => {
    if (filename && flvjs.isSupported()) {
      const loadPlayer = async () => {
        if (flvPlayerRef.current) {
          flvPlayerRef.current.destroy();
        }

        flvPlayerRef.current = flvjs.createPlayer({
          type: "flv",
          url: `http://localhost:8000/live/${filename}.flv`,
        });

        if (videoRef.current) {
          flvPlayerRef.current.attachMediaElement(videoRef.current);
          await flvPlayerRef.current.load();
          try {
            await flvPlayerRef.current.play();
            setIsPlaying(true);
          } catch (error) {
            console.error("Error playing video:", error);
            setIsPlaying(false);
          }
        }
      };

      loadPlayer();
    }

    return () => {
      if (flvPlayerRef.current) {
        flvPlayerRef.current.destroy();
        flvPlayerRef.current = null;
      }
    };
  }, [filename]);


  return (
    <div>
      <div className="relative w-full aspect-video overflow-hidden rounded-lg p-2">
        <video
          ref={videoRef}
          className="w-full rounded-lg shadow-lg"
          controls
        ></video>
        <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
          LIVE
        </div>
      </div>
      <VideoDescription
        title={videoData.title}
        username={videoData.username}
        profilePicture={videoData.profilePicture}
        description={videoData.description}
      />
    </div>
  );
};

export default LivePlayer;
