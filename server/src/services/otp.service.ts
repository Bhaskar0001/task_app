import { User } from '../models/User';
import { generateOtp, hashOtp, compareOtp } from '../utils/otp';
import { config } from '../config/env';
import { AppError } from '../middleware/error.middleware';

export const generateAndStoreOtp = async (email: string): Promise<string> => {
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email });
  }

  const now = new Date();
  if (user.otpLastSentAt) {
    const timeDiff = (now.getTime() - user.otpLastSentAt.getTime()) / 1000;
    if (timeDiff < config.otpResendCooldownSeconds) {
      const waitTime = config.otpResendCooldownSeconds - Math.floor(timeDiff);
      throw new AppError(`Please wait ${waitTime} seconds before requesting a new code.`, 429);
    }
  }

  const otp = generateOtp();
  const hashed = await hashOtp(otp);

  user.otpHash = hashed;
  user.otpExpiresAt = new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000);
  user.otpAttempts = 0;
  user.otpLastSentAt = now;

  await user.save();
  return otp;
};

export const verifyOtpMatch = async (email: string, otp: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('User not found', 404);
  if (!user.otpHash || !user.otpExpiresAt) throw new AppError('No verification code requested. Please request a new code.', 400);

  if (user.otpAttempts >= config.otpMaxAttempts) {
    throw new AppError('Too many failed attempts. Please request a new code.', 429);
  }

  if (new Date() > user.otpExpiresAt) {
    throw new AppError('Verification code has expired. Please request a new code.', 400);
  }

  const isMatch = await compareOtp(otp, user.otpHash);
  if (!isMatch) {
    user.otpAttempts += 1;
    await user.save();
    throw new AppError('Invalid verification code.', 400);
  }

  user.otpHash = undefined;
  user.otpExpiresAt = undefined;
  user.otpAttempts = 0;
  await user.save();

  return user;
};
