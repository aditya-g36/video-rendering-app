import prisma from "../prisma";

export const createUser = async (
  username: string,
  email: string,
  password: string,
) => {
  return prisma.user.create({
    data: {
      username,
      email,
      password,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};


export const findUnique = async (
  userId: number
) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      videos: true,
    },
  });
}
