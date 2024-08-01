import prisma from "../prisma";
import { PrismaClient, Prisma } from "@prisma/client";

export const findFirst = async (
  filename: string
) => {
  return prisma.video.findFirst({
    where: { filename: filename },
  });
}


export const createvideo = async (
  title: string,
  filename: string,
  originalName: string,
  description: string,
  url: string,
  thumbnail: string,
  userId: number,
) => {
  return prisma.video.create({
    data: {
      title,
      filename,
      originalName,
      description,
      url,
      thumbnail,
      userId,
    },
  });
}

export const findMany = async () => {
  return prisma.video.findMany({
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
    take: 20,
    orderBy: {
      id: "asc",
    },
  });
}

const QueryMode = Prisma.QueryMode;



export const SvideoFindMany = async (
  searchTerm: string,
) => {
  const searchCondition = {
    OR: [
      { title: { contains: searchTerm, mode: QueryMode.insensitive } },
      { description: { contains: searchTerm, mode: QueryMode.insensitive } },
    ],
  };
  return prisma.video.findMany({
    where: searchCondition,
    select: {
      id: true,
      title: true,
      description: true,
      filename: true,
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
}
