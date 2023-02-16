import * as dotenv from 'dotenv';
dotenv.config();
export const database = {
  user: process.env.MONGO_DATABASE_USER_NAME || '',
  password: process.env.MONGO_DATABASE_PASSWORD || '',
  database: process.env.MONGO_DATABASE_NAME || 'SECURE_VAULT',
  host: process.env.MONGO_DATABASE_HOST || 'localhost',
  port: process.env.MONGO_DATABASE_PORT || 27107,
};
