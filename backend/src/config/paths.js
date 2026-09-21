import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const BACKEND_SRC = path.resolve(__dirname, '..');
export const BACKEND_ROOT = path.resolve(BACKEND_SRC, '..');
export const WORKSPACE_ROOT = path.resolve(BACKEND_ROOT, '..');

export const FRONTEND_DATA_DIR = path.join(WORKSPACE_ROOT, 'frontend', 'src', 'data');
export const SCHEMA_PATH = path.join(WORKSPACE_ROOT, 'content-schema.json');
