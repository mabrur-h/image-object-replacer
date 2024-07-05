import dotenv from 'dotenv';
import { Env } from '../types';

dotenv.config();

export const env: Env = {
  port: parseInt(process.env.PORT || '3000', 10),
  photAiApiKey: process.env.PHOT_AI_API_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
};
