import { Request, Response } from 'express';
import prisma from '../prisma';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        videos: true,
      },
    });

    res.json(user);
  } catch (error) {
    if (error instanceof Error){
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error : 'An unexpected error occurred'});
    }
  }
};
