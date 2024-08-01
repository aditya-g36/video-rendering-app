import { useContext } from "react";
import VideoCard from "../components/videocard";
import AuthContext from "../context/AuthContext";
import { useEffect, useState } from "react";

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  profilePicture: string;
  username: string;
  filename: string;
  description: string;
  // Add any other properties that your video objects have
}

const HomePage = () => {
  const user = useContext(AuthContext);
  const [suggestedVideos, setSuggestedVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSuggestedContent();
  }, [user.id]);

  const fetchSuggestedContent = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/videos/random/${user.id}`,
      );
      const data = await response.json();
      if (response.status === 200) {
        setSuggestedVideos(data);
      } else {
        setError("Unable to load content. Please refresh the page.");
      }
    } catch (error) {
      console.error("Error fetching suggested content:", error);
      setError("An error occurred. Please try again later.");
    }
  };
  return (
    <div className="flex flex-wrap gap-20 pl-5">
      {suggestedVideos.map((video) => (
        <div key={video.id} className="max-w-[400px]">
          <VideoCard data={video} />
        </div>
      ))}
    </div>
  );
};

export default HomePage;
