import { Request, Response } from "express";
import { createUser, findUserByEmail, findUnique } from "../dao/user";
import jwt from "jsonwebtoken";
import { createProfile } from "../dao/profile";

export const register = async (req: Request, res: Response) => {
  const { username, email, password, password2 } = req.body;
  if (password != password2) {
    return res.status(400).json({ error: "Password does not match" });
  }
  try {
    const user = await createUser(username, email, password);

    await createProfile(user.id);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
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
    const user = await findUserByEmail(email);

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


export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await findUnique(userId);

    res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unexpected error occurred" });
    }
  }
};
