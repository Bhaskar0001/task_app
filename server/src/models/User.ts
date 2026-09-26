import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  otpHash?: string;
  otpExpiresAt?: Date;
  otpAttempts: number;
  otpLastSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    otpHash: { type: String },
    otpExpiresAt: { type: Date },
    otpAttempts: { type: Number, default: 0 },
    otpLastSentAt: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
