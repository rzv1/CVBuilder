import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/api/tests/**/*.test.js'],
    setupFiles: ['src/api/tests/setup.js'],
    fileParallelism: false,
    maxConcurrency: 1,
    globals: true,
    env: {
      DATABASE_URL: 'file:./test.db',
      NODE_ENV: 'test'
    }
  }
});
