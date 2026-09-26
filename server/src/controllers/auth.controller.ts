import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const sendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    await authService.sendOtp(email);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyOtp(email, otp);
    res.json({
      success: true,
      message: 'Verified successfully',
      token: result.token,
      user: result.user,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
