class HeaderComponent {
  elements = {
    logoLink: () => cy.get('.header_logo'),
    garageLink: () => cy.get('.header-link').contains('Garage'),
    expensesLink: () => cy.get('.header-link').contains('Fuel expenses'),
    instructionsLink: () => cy.get('.header-link').contains('Instructions'),
    myProfileBtn: () => cy.get('#userNavDropdown')
  }

  clickGarageLink() {
    this.elements.garageLink().click();
  }

  clickExpensesLink() {
    this.elements.expensesLink().click();
  }

  clickInstructionsLink() {
    this.elements.instructionsLink().click();
  }

  clickOnLogo() {
    this.elements.logo().click();
  }

  checkRedirectedToGarage() {
    cy.url().should('include', '/panel/garage');
    this.elements.garageLink().should('have.class', '-active');

  }

  checkRedirectedToExpenses() {
    cy.url().should('include', '/panel/expenses');
    this.elements.expensesLink().should('have.class', '-active');
  }

  checkRedirectedToInstructions() {
    cy.url().should('include', '/instructions');
    this.elements.instructionsLink().should('have.class', '-active');
  }
}

export default new HeaderComponent()
