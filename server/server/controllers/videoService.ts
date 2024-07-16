import { PrismaClient, Prisma } from "@prisma/client";

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

    const videos = await prisma.video.findMany({
      where: searchCondition,
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        thumbnail: true,
        user: {
          select: {
            username: true,
            profile: { select: { profilePicture: true } },
          },
        },
      },
    });

    const streams = await prisma.stream.findMany({
      where: { ...searchCondition, status: "live" },
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        streamKey: true,
        user: {
          select: {
            username: true,
            profile: { select: { profilePicture: true } },
          },
        },
      },
    });

    const formatResult = (item: any, isLiveStream: boolean) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      url: item.url,
      thumbnail: isLiveStream ? null : item.thumbnail,
      username: item.user.username,
      profilePicture:
        item.user.profile?.profilePicture || "default_profile_picture_url",
      isLiveStream,
      streamKey: isLiveStream ? item.streamKey : null,
    });

    const results = [
      ...videos.map((video) => formatResult(video, false)),
      ...streams.map((stream) => formatResult(stream, true)),
    ];

    return results.sort(
      (a, b) => Number(b.isLiveStream) - Number(a.isLiveStream)
    );
  }
}

export default VideoService;
