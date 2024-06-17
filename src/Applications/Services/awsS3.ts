import dotenv from 'dotenv';

import { S3Client } from '@aws-sdk/client-s3';
import { AppError } from '@Domain/Exceptions/AppError';

dotenv.config();

const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_KEY;


if (!region || !accessKeyId || !secretAccessKey) {
  throw new AppError('Some of properties is undefined!', 404);
}

export const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

