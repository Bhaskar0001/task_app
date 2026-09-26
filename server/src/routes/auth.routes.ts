import { Router } from 'express';
import { sendOtp, verifyOtp } from '../controllers/auth.controller';
import { validateSendOtp, validateVerifyOtp } from '../validators/auth.validator';

const router = Router();

router.post('/send-otp', validateSendOtp, sendOtp);
router.post('/verify-otp', validateVerifyOtp, verifyOtp);

export default router;
