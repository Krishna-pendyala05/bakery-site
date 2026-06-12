import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    mobile: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Authentication token required' });
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || 'supersecretjwtkeyforlocaldevelopment123456',
    (err, decoded: any) => {
      if (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
        return;
      }
      req.user = decoded;
      next();
    }
  );
};
