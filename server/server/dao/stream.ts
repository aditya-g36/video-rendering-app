import prisma from "../prisma";
import { PrismaClient, Prisma } from "@prisma/client";

export const createstream = async (
  userId: number,
  title: string,
  description: string,
  streamKey: string,
  url: string,
) => {
  return prisma.stream.create({
    data: {
      userId,
      title,
      description,
      url,
      streamKey,
    },
  });
};

const QueryMode = Prisma.QueryMode;

export const SstreamFindMnay = async (
  searchTerm: string,
) => {
  const searchCondition = {
    OR: [
      { title: { contains: searchTerm, mode: QueryMode.insensitive } },
      { description: { contains: searchTerm, mode: QueryMode.insensitive } },
    ],
  };

  return prisma.stream.findMany({
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
}
