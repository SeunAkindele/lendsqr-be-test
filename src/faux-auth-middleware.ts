// src/faux-auth-middleware.ts
import { Request, Response, NextFunction } from 'express';

export function fauxAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers['authorization'];
  
  if (token && token === `Bearer ${process.env.FAUX_TOKEN}`) {
    next(); // Proceed to the next middleware or route handler
  } else {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}
