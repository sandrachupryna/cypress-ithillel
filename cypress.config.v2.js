import { defineConfig } from "cypress";
import 'dotenv/config';
import { plugin as cypressGrepPlugin } from '@cypress/grep/plugin';
import fs from 'fs';


export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      cypressGrepPlugin(config);
      const envData = JSON.parse(fs.readFileSync('./cypress.env.v2.json', 'utf8'));

      config.env = {
        ...config.env,
        ...envData
      };

      return config    
    },
    baseUrl: 'https://qauto2.forstudy.space/',
    defaultCommandTimeout: 5000,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultBrowser: 'chrome',
    env: {
      username: process.env.BASIC_AUTH_USERNAME,
      password: process.env.BASIC_AUTH_PASSWORD,
    },
  },
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: false,
    html: false,
    json: true,
  },
});
