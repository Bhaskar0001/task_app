import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validationHandler = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    res.status(400).json({ success: false, message: messages[0], errors: errors.array() });
    return;
  }
  next();
};

export const validateSendOtp = [
  body('email').trim().isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  validationHandler,
];

export const validateVerifyOtp = [
  body('email').trim().isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits').isNumeric().withMessage('OTP must contain only numbers'),
  validationHandler,
];
