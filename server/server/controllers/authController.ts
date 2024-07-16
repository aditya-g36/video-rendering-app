import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";

export const register = async (req: Request, res: Response) => {
  const { username, email, password, password2 } = req.body;
  if (password != password2) {
    return res.status(400).json({ error: "Password does not match" });
  }
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });

    await prisma.profile.create({
      data: {
        userId: user.id, // Link the profile to the newly created user
        bio: "", // Default bio
        followers: 0, // Default followers count
        following: 0, // Default following count
        profilePicture:
          "https://imgs.search.brave.com/5cAi-jXDh0PdCGuh2vvsggwMUWvGlmTFmbCQ7jYJ9OI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc", // Default profile picture URL
      },
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Assert the error as an Error object to access the message property
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unexpected error occurred" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || password != user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unexpected error occurred" });
    }
  }
};
