import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const BACKEND_SRC = path.resolve(__dirname, '..');
export const BACKEND_ROOT = path.resolve(BACKEND_SRC, '..');
export const WORKSPACE_ROOT = path.resolve(BACKEND_ROOT, '..');

// Data paths (frontend/src/data or backend/src/data)
export const FRONTEND_DATA_DIR = path.join(WORKSPACE_ROOT, 'frontend', 'src', 'data');
export const BLOG_DATA_PATH = path.join(FRONTEND_DATA_DIR, 'blogData.js');
export const CONTENT_DATA_PATH = path.join(FRONTEND_DATA_DIR, 'content.json');
export const STYLE_DATA_PATH = path.join(FRONTEND_DATA_DIR, 'style.json');
export const USERS_DATA_PATH = path.join(FRONTEND_DATA_DIR, 'users.json');
export const SCHEMA_PATH = path.join(WORKSPACE_ROOT, 'content-schema.json');
export const CMS_UI_DIR = path.join(BACKEND_SRC, 'cms-ui');
