export const expectInvalidFieldAndErrorMessage = (field, errorMessage) => {
  cy.getRegistrationField(field)
    .should('have.class', 'is-invalid')
    .and('have.css', 'border-color', 'rgb(220, 53, 69)');

  cy.getErrorMessage(field)
    .should('be.visible')
    .and('have.text', errorMessage)
    .and('have.css', 'color', 'rgb(220, 53, 69)');
};