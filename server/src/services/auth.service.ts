import { generateAndStoreOtp, verifyOtpMatch } from './otp.service';
import { sendOtpEmail } from './email.service';
import { generateToken } from '../utils/jwt';

export const sendOtp = async (email: string): Promise<void> => {
  const otp = await generateAndStoreOtp(email);
  await sendOtpEmail(email, otp);
};

export const verifyOtp = async (email: string, otp: string) => {
  const user = await verifyOtpMatch(email, otp);
  const token = generateToken(user._id.toString());
  return { token, user: { id: user._id.toString(), email: user.email } };
};
