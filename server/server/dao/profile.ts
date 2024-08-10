import prisma from "../prisma";


export const createProfile = async (userId: number) => {
  return prisma.profile.create({
    data: {
      userId,
      bio: "",
      followers: 0,
      following: 0,
      profilePicture:
        "https://imgs.search.brave.com/5cAi-jXDh0PdCGuh2vvsggwMUWvGlmTFmbCQ7jYJ9OI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc", // Default profile picture URL
    },
  });
};


export const findprofile = async (
  profileId: number,
) => {
  return prisma.profile.findUnique({
    where: { id: profileId },
  });
};

export const createprofile = async (
  bio: string,
  followers: number,
  following: number,
  profilePicture: string,
  userId: number,
) => {
  return prisma.profile.create({
    data: { bio, followers, following, profilePicture, userId },
  })
};

export const updateprofilePut = async (
  profileId: number,
  body: any
) => {
  return prisma.profile.update({
    where: { id: profileId },
    data: body
  });
}

export const updateprofilePatch = async (
  profileId: number,
  body: any
) => {
  return prisma.profile.update({
    where: { id: profileId },
    data: body
  });
}



export const deleteprofile = async (
  profileId: number
) => {
  return prisma.profile.delete({
    where: { id: profileId }
  });
}
