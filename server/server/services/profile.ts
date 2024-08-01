
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  deleteprofile,
  findprofile,
  createprofile,
  updateprofilePut,
  updateprofilePatch,
} from "../dao/profile.dao";

const prisma = new PrismaClient();

export const handleProfileRequest = async (req: Request, res: Response) => {
  const { method, params, body } = req;
  const profileId = Number(params.id);

  try {
    switch (method) {
      case "GET":
        if (profileId) {
          // Get a specific profile by ID
          const profile = await findprofile(profileId);
          if (profile) {
            return res.json(profile);
          } else {
            return res.status(404).json({ error: "Profile not found" });
          }
        } else {
          // If no ID, return all profiles
          const profiles = await prisma.profile.findMany();
          return res.json(profiles);
        }

      case "POST":
        // Create a new profile
        const { bio, followers, following, profilePicture, userId } = body;
        if (!userId) {
          return res.status(400).json({ error: "userId is required" });
        }
        const newProfile = await createprofile(
          bio,
          followers,
          following,
          profilePicture,
          userId
        );
        return res.status(201).json(newProfile);

      case "PUT":
        // Update a profile by ID (Replace all fields)
        if (!profileId) {
          return res.status(400).json({ error: "Profile ID is required" });
        }
        const updatedProfile = await updateprofilePut(profileId, body);
        return res.json(updatedProfile);

      case "PATCH":
        // Partially update a profile by ID
        if (!profileId) {
          return res.status(400).json({ error: "Profile ID is required" });
        }
        const patchedProfile = await updateprofilePatch(profileId, body);
        return res.json(patchedProfile);

      case "DELETE":
        // Delete a profile by ID
        if (!profileId) {
          return res.status(400).json({ error: "Profile ID is required" });
        }
        const deletedProfile = await deleteprofile(profileId);
        return res.json(deletedProfile);

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "PATCH", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};



