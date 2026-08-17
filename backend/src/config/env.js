import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKEND_ROOT = path.resolve(__dirname, '../..');

dotenv.config({ path: path.join(BACKEND_ROOT, '.env') });

export const PORT = process.env.PORT || 3001;
export const DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY || '';
