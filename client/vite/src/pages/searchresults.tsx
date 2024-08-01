import { useContext } from "react";
import ResultCard from "../components/ResultCard";
import AuthContext from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

const HomePage = () => {
  const user = useContext(AuthContext);
  const [suggestedVideos, setSuggestedVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { searchquery } = useParams<{ searchquery: string }>();

  useEffect(() => {
    fetchSuggestedContent();
  }, [user.id]);

  const fetchSuggestedContent = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/search/searchquery/${searchquery}`,
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
    <div className="flex flex-wrap gap-20 pl-5 bg-[#000000]">
      {suggestedVideos.map((video) => (
        <div key={video.id}>
          <ResultCard data={video} />
        </div>
      ))}
    </div>
  );
};

export default HomePage;
