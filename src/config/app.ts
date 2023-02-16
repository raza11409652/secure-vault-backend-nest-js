import * as dotenv from 'dotenv';
dotenv.config();
export const appConfig = {
  frontEndURL: process.env.APP_URL_FRONT_END || 'http://localhost:5173/',
};
