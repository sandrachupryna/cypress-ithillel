import { defineConfig } from "cypress";
import 'dotenv/config';
import { plugin as cypressGrepPlugin } from '@cypress/grep/plugin'


export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      cypressGrepPlugin(config)
      return config    
    },
    baseUrl: 'https://qauto.forstudy.space/',
    defaultCommandTimeout: 5000,
    // to run examples
    // specPattern: 'cypress/examples/e2e/**/*.cy.js',
    // fixturesFolder: 'cypress/examples/fixtures',
    // supportFile: 'cypress/examples/support/e2e.js',
    
    // to run my tests 
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultBrowser: 'chrome',
    env: {
      username: process.env.BASIC_AUTH_USERNAME,
      password: process.env.BASIC_AUTH_PASSWORD,
    },
  },
});
