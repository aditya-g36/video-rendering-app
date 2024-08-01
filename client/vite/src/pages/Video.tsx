import { useLocation } from "react-router-dom";
import VideoPlayer from "../components/videoplayer";
import VideoDescription from "../components/Description";

const Video = () => {
  const location = useLocation();
  const videoData = location.state?.videoData;

  if (!videoData) {
    return <div>Video data not found</div>;
  }

  return (
    <div>
      <VideoPlayer />
      <VideoDescription
        title={videoData.title}
        username={videoData.username}
        profilePicture={videoData.profilePicture}
        description={videoData.description}
      />
    </div>
  );
};

export default Video;
