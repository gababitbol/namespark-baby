'use strict';

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  testMatch: '*.spec.js',
  timeout: 180_000,       // 3min par test : data.js=2.7Mo + Supabase
  retries: 0,
  workers: 1,             // sériel par défaut : les scénarios se dépendent
  outputDir: 'test-results/artifacts',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-results/html', open: 'never' }],
    ['./reporter.js'],
  ],
  use: {
    baseURL: 'https://namespark.baby',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
    // data.js est ~2,7 Mo — lui donner le temps de charger
    navigationTimeout: 120_000,
    actionTimeout:      30_000,
  },
});
