Cypress.Commands.add('openHomePageAndLoginByBasicAuth', () => {
    cy.visit('/', {
      auth: {
        username: Cypress.env('username'),
        password: Cypress.env('password'),
      },
    });
});