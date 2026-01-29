describe('Basic auth', () => {
  it('should login using url credentials', () => {
    const username = Cypress.env('username');
    const password = Cypress.env('password');
    console.log('USERNAME:', username);
    console.log('PASSWORD:', password);

    const url = `https://${username}:${password}@qauto.forstudy.space`;

    cy.visit(url);
    cy.get('.header .header_signin')
        .should('be.visible')
        .should('have.text', 'Sign In');
  });

  it('should login using basic auth', () => {
    cy.visit('/', {
      auth: {
        username: Cypress.env('username'),
        password: Cypress.env('password'),
      },
    });
    cy.get('.header .header_signin')
        .should('be.visible')
        .should('have.text', 'Sign In');
  });
});