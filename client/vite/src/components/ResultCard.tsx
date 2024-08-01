import { useNavigate } from "react-router-dom";
import { Image, Avatar } from "@nextui-org/react";

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  profilePicture: string;
  filename: string;
  username: string;
  isLiveStream: boolean;
  streamKey: string;
}

interface VideoCardProps {
  data: Video;
}

export default function ResultCard({ data }: VideoCardProps) {
  const navigate = useNavigate();

  const playVideo = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent any default action
    if (data.isLiveStream == true) {
      navigate(`/live/${data.streamKey}`, { state: { videoData: data } });
    } else {
      navigate(`/video/${data.filename}`, { state: { videoData: data } });
    }
  };

  return (
    <div
      onClick={playVideo}
      className="w-full max-w-[400px] cursor-pointer mb-4"
    >
      <div className="relative w-full aspect-video overflow-hidden rounded-lg">
        <Image
          src={data.thumbnail}
          alt={data.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
          // duration
        </div>
      </div>
      <div className="mt-2 flex">
        <div className="flex-shrink-0 mr-3">
          <Avatar src={data.profilePicture} size="sm" alt={data.username} />
        </div>
        <div className="flex-grow">
          <h3 className="text-sm font-semibold line-clamp-2 mb-1">
            {data.title}
          </h3>
          <p className="text-xs text-gray-500">{data.username}</p>
        </div>
      </div>
    </div>
  );
}
