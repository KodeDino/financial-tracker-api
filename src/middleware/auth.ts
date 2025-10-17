import { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any)?.id

  if(!userId) {
    res.status(401).json({ error: 'Not authenticated' })
    return;
  }

  next();
}