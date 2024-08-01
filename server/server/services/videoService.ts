import { PrismaClient, Prisma } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import { SstreamFindMnay } from "../dao/stream.dao";
import { SvideoFindMany } from "../dao/video.dao";

const prisma = new PrismaClient();
const QueryMode = Prisma.QueryMode;

class VideoService {
  static async searchVideosAndStreams(searchTerm: string) {
    const searchCondition = {
      OR: [
        { title: { contains: searchTerm, mode: QueryMode.insensitive } },
        { description: { contains: searchTerm, mode: QueryMode.insensitive } },
      ],
    };

    const videos = await SvideoFindMany(searchTerm);
    const streams = await SstreamFindMnay(searchTerm);

    const formatResult = async (item: any, isLiveStream: boolean) => {
      let thumbnailData = null;
      if (!isLiveStream && item.thumbnail) {
        try {
          const thumbnailPath = path.join(
            process.cwd(),
            "uploads",
            path.basename(item.thumbnail)
          );
          thumbnailData = await fs.readFile(thumbnailPath, {
            encoding: "base64",
          });
        } catch (error) {
          console.error(`Error reading thumbnail for video ${item.id}:`, error);
        }
      }

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        url: item.url,
        filename: isLiveStream ? null : item.filename,
        thumbnail: thumbnailData
          ? `data:image/jpeg;base64,${thumbnailData}`
          : null,
        username: item.user.username,
        profilePicture:
          item.user.profile?.profilePicture || "default_profile_picture_url",
        isLiveStream,
        streamKey: isLiveStream ? item.streamKey : null,
      };
    };

    const results = await Promise.all([
      ...videos.map((video) => formatResult(video, false)),
      ...streams.map((stream) => formatResult(stream, true)),
    ]);

    return results.sort(
      (a, b) => Number(b.isLiveStream) - Number(a.isLiveStream)
    );
  }
}

export default VideoService;
