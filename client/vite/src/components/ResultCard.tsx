import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate(); // Changed from history to navigate
  console.log(data);
  const playVideo = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent any default action
    if (data.isLiveStream == true) {
      navigate(`/live/${data.streamKey}`);
    } else {
      navigate(`/video/${data.filename}`);
    }
  };

  return (
    <div onClick={playVideo}>
      <Card
        isFooterBlurred
        className="w-[400px] h-[260px] col-span-12 sm:col-span-6 cursor-pointer"
        onClick={playVideo}
      >
        <Image
          removeWrapper
          alt="Relaxing app background"
          className="z-0 w-full h-full object-cover"
          src={data.thumbnail}
        />
        <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
          <div className="flex flex-grow flex-col">
            <p className=" text-white/60">{data.title}</p>
            <div className="flex items-center gap-2">
              <Image
                alt="Breathing app icon"
                className="rounded-full w-10 h-11 bg-black"
                src={data.profilePicture}
              />
              <p className="text-white/60">{data.username}</p>
            </div>
          </div>
          <Button radius="full" size="sm">
            Get App
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
