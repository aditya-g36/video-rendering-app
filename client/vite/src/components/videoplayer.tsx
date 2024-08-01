import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MdOutlineHighQuality } from "react-icons/md";

type Quality = "low" | "medium" | "high";

const VideoPlayer: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [quality, setQuality] = useState<Quality>("medium");
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const { filename } = useParams<{ filename: string }>();

  useEffect(() => {
    if (filename) {
      setVideoUrl(
        `http://localhost:5000/api/stream/${filename}?quality=${quality}`,
      );
    }
  }, [filename, quality]);

  const handleQualityChange = (newQuality: Quality) => {
    setQuality(newQuality);
    setShowQualityMenu(false);
  };

  return (
    <div className="mt-1 mr-5 relative">
      <video src={videoUrl} className="w-full h-full" controls>

      </video>
      <div className="absolute bottom-9 right-52">
        <button
          onClick={() => setShowQualityMenu(!showQualityMenu)}
          className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
        >
          <MdOutlineHighQuality size={20} />
        </button>
        {showQualityMenu && (
          <div className="absolute bottom-full right-0 mb-2 bg-black bg-opacity-75 text-white rounded p-2">
            <div className="text-sm font-bold mb-1">Quality</div>
            {["low", "medium", "high"].map((q) => (
              <div
                key={q}
                onClick={() => handleQualityChange(q as Quality)}
                className={`cursor-pointer py-1 px-2 hover:bg-white hover:bg-opacity-20 rounded ${quality === q ? "bg-white bg-opacity-20 text-black" : ""
                  }`}
              >
                {q.charAt(0).toUpperCase() + q.slice(1)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default VideoPlayer;
