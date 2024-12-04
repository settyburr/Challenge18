import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

export const authenticateToken = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('Unauthorized');
  }

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET_KEY || '';

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      res.status(403).send('Forbidden');
    }

    req.user = user as JwtPayload; 
    
  });
  return req;
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export const createContext = ({ req }: { req: Request }) => {
  const authHeader = req.headers.authorization;
  let user: JwtPayload | null = null;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRECT_KEY || '';

    try {
      const decoded = jwt.verify(token, secretKey) as JwtPayload;
      user = decoded;
    } catch {
      //Failed set user to null
    }
  }
  return { user };
};
