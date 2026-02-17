describe('Check Garage page', () => {
    beforeEach(() => {
        cy.ensureUserExistsAndLoginViaSession({ 
            email: Cypress.env('testUserEmail'), 
            password: Cypress.env('testUserPassWord'),
            name: Cypress.env('testUserName'),
            lastName: Cypress.env('testUserLastName')
        });
        cy.visitWithAuth('/panel/garage')
    });

    it('Check the panel name', () => {
        cy.get('.panel-page').contains('Garage').should('exist');
    });

    describe('Check the navigation in header', () => {
        it('My profile dropdown should exist' , () => {
            cy.get('#userNavDropdown').should('include.text', 'My profile');
        });
    });
});