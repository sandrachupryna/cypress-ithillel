class BasePage {
  visitLogined(url) {
    cy.ensureUserExistsAndLoginViaSession({ 
        email: Cypress.env('testUserEmail'), 
        password: Cypress.env('testUserPassWord'),
        name: Cypress.env('testUserName'),
        lastName: Cypress.env('testUserLastName')
    });
    cy.visitWithAuth(url);
  }
}

export default BasePage;