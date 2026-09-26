import { Resend } from 'resend';
import { config } from '../config/env';
import { AppError } from '../middleware/error.middleware';

export const sendOtpEmail = async (email: string, otp: string): Promise<void> => {
  // Always log OTP in server console for development and testing convenience
  console.log(`\n========================================`);
  console.log(`[AUTH OTP] Code for ${email}: ${otp}`);
  console.log(`========================================\n`);

  if (!config.resendApiKey) {
    console.warn('[AUTH] RESEND_API_KEY is not set. OTP logged to console only.');
    return;
  }

  const resend = new Resend(config.resendApiKey);

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 440px; margin: 0 auto; padding: 24px; border: 1px solid #E5E7EB; borderRadius: 8px;">
      <h2 style="color: #111827; margin-top: 0;">Your Verification Code</h2>
      <p style="color: #4B5563; font-size: 14px;">Use the verification code below to sign in to Task Manager:</p>
      <div style="background-color: #F8F9FB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #2563EB;">${otp}</span>
      </div>
      <p style="color: #6B7280; font-size: 13px;">This code expires in ${config.otpExpiryMinutes} minutes.</p>
      <p style="color: #9CA3AF; font-size: 12px; margin-bottom: 0;">If you did not request this code, you can safely ignore this email.</p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: config.resendFromEmail,
      to: email,
      subject: 'Your Task Manager verification code',
      html,
    });

    if (error) {
      console.error('[Resend Error Details]:', JSON.stringify(error, null, 2));
      // Provide a clean, helpful message to client while logging full error
      const userMessage = error.message || 'Failed to deliver email through Resend';
      throw new AppError(userMessage, 500);
    }

    console.log(`[Resend] Email dispatched successfully to ${email}. ID: ${data?.id}`);
  } catch (err: any) {
    if (err instanceof AppError) throw err;
    console.error('[Resend Exception]:', err.message || err);
    throw new AppError(err.message || 'Failed to send verification email. Please try again.', 500);
  }
};
