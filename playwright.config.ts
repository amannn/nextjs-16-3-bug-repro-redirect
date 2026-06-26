import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {baseURL: 'http://localhost:3000'},
  webServer: {
    command: 'npm run build && npm start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000
  }
});
