import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { config } from '../config/env';

export interface TokenPayload extends JwtPayload {
  userId: string;
}

export const generateToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as any,
  };
  return jwt.sign({ userId }, config.jwtSecret, options);
};

export const verifyToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, config.jwtSecret);
  return decoded as TokenPayload;
};
