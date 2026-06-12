import { Request, Response } from 'express';
import prisma from '../config/db';

export const getCakes = async (req: Request, res: Response): Promise<void> => {
  try {
    const cakes = await prisma.cake.findMany({
      where: {
        available: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
    res.json(cakes);
  } catch (error: any) {
    console.error('Error fetching cakes:', error);
    res.status(500).json({ message: 'Error fetching cakes menu from database' });
  }
};
