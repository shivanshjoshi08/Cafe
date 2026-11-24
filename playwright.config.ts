/*
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/browser',
    timeout: 45_000,
    expect: {
        timeout: 10_000
    },
    workers: 2,
    use: {
        baseURL: 'https://cafe-blond-seven.vercel.app/',
        trace: 'retain-on-failure',
    },
    webServer: {
        command: 'powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/start-local.ps1',
        url: 'https://cafe-blond-seven.vercel.app/',
        reuseExistingServer: true,
        timeout: 120_000,
    },
});
*/