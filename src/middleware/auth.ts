import { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  next();
};
