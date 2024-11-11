import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const fauxAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];

  if (token && token === `Bearer ${process.env.FAUX_TOKEN}`) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}
