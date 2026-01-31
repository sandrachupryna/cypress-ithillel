import { expectInvalidFieldAndErrorMessage } from '../support/assertion.js';

describe('Check registration process', () => {
    beforeEach(() => {
        cy.fixture('registration.json').as('registrationData');
        cy.openHomePageAndLoginByBasicAuth();
        cy.clickSignUpButton();
    });

    describe('Check registration modal window', () => {
        it('Registration form appears after clicking sign up button', () => {
            cy.get('app-signup-modal')
                .should('exist')
                .should('be.visible')
                .find('.modal-title')
                .should('be.visible')
                .should('include.text', 'Registration');
        });
        
        it('Registration form dissappers after clicking close button', () => {
            cy.get('app-signup-modal [aria-label="Close"]')
                .should('be.enabled')
                .click();
            
            cy.get('app-signup-modal')
                .should('not.exist');
        });
    });

    describe('Smoke tests', () => {
        it('Registration with valid data', () => {
            cy.getFieldLabel('signupName').should('have.text', 'Name');
            cy.getFieldLabel('signupLastName').should('have.text', 'Last name');
            cy.getFieldLabel('signupEmail').should('have.text', 'Email');
            cy.getFieldLabel('signupPassword').should('have.text', 'Password');
            cy.getFieldLabel('signupRepeatPassword').should('have.text', 'Re-enter password');

            cy.fillRegistrationForm({});
            cy.getRegistrationButton()
                .should('be.enabled')
                .click();
            
            cy.get('app-signup-modal')
                .should('not.exist');
        });
        it('Check login with registered user', () => {
            cy.fillRegistrationForm({}).as('registrationData');
            cy.getRegistrationButton()
                .should('be.enabled')
                .click();
            
            cy.get('@registrationData').then((userData) => {
              cy.fillLoginFormAndSubmit({ email: userData.signupEmail, password: userData.signupPassword});
              cy.get('body').contains('You have been successfully logged in').should('exist');
            });
        });

    });

    describe('Check fields validation', () => {
        describe('Required fields validation', () => {
            it('Should show validation messages when required fields are empty', () => {
                const requiredFields = [
                    { field: 'signupName', message: 'Name required' },
                    { field: 'signupLastName', message: 'Last name required' },
                    { field: 'signupEmail', message: 'Email required' },
                    { field: 'signupPassword', message: 'Password required' },
                    { field: 'signupRepeatPassword', message: 'Re-enter password required' },
                ];

                requiredFields.forEach(({field, message}) => {
                    cy.fillRegistrationForm({ excludedField: field });
                    cy.getRegistrationButton()
                        .should('be.disabled')
                    expectInvalidFieldAndErrorMessage(field, message);
                });
            });
        });
        describe('Name and Last Name validation', () => {
            describe('Name and Last Name length validation, check boundaries', () => {
                it('Should show validation messages for Name field when input has wrong length', () => {
                    const field = 'signupName';
                    const cases = [
                        { value: 'A', valid: false, message: 'Name has to be from 2 to 20 characters long'},
                        { value: 'Ab', valid: true },
                        { value: 'A'.repeat(20), valid: true },
                        { value: 'A'.repeat(21), valid: false, message: 'Name has to be from 2 to 20 characters long'},
                    ];
                    cases.forEach(({value, valid, message}) => {
                        cy.fillRegistrationForm({ overrides: { [field]: value } });
                        if (!valid) {
                            expectInvalidFieldAndErrorMessage(field, message);
                            cy.getRegistrationButton()
                                .should('be.disabled')
                        } else {
                            cy.getErrorMessage(field)
                                .should('not.exist');
                            cy.getRegistrationField(field)
                                .should('not.have.class', 'is-invalid');
                            cy.getRegistrationButton()
                                .should('be.enabled')
                        }
                    });   
                });

                it('Should show validation messages for Last Name field when input has wrong length', () => {
                    const field = 'signupLastName';
                    const cases = [
                        { value: 'A', valid: false, message: 'Last name has to be from 2 to 20 characters long'},
                        { value: 'Ab', valid: true },
                        { value: 'A'.repeat(20), valid: true },
                        { value: 'A'.repeat(21), valid: false, message: 'Last name has to be from 2 to 20 characters long'},
                    ];
                    cases.forEach(({value, valid, message}) => {
                        cy.fillRegistrationForm({ overrides: { [field]: value } });
                        if (!valid) {
                            expectInvalidFieldAndErrorMessage(field, message);
                            cy.getRegistrationButton()
                                .should('be.disabled')
                        } else {
                            cy.getErrorMessage(field)
                                .should('not.exist');
                            cy.getRegistrationField(field)
                                .should('not.have.class', 'is-invalid');
                            cy.getRegistrationButton()
                                .should('be.enabled')
                        }
                    });   
                });  
            });

            describe('Name and Last Name character validation', () => {
                it('Should show validation messages for Name field when input has invalid characters', () => {
                    const field = 'signupName';
                    cy.get('@registrationData').then((registrationData) => {
                        const invalidValues = registrationData.invalidNames;
                        invalidValues.forEach(value => {
                            cy.fillRegistrationForm({ overrides: { [field]: value } });
                            expectInvalidFieldAndErrorMessage(field, 'Name is invalid');
                            cy.getRegistrationButton()
                                .should('be.disabled')
                        });
                    });
                });

                it('Should show validation messages for Last Name field when input has invalid characters', () => {
                    const field = 'signupLastName';
                    cy.get('@registrationData').then((registrationData) => {
                        const invalidValues = registrationData.invalidLastNames;
                        invalidValues.forEach(value => {
                            cy.fillRegistrationForm({ overrides: { [field]: value } });
                            expectInvalidFieldAndErrorMessage(field, 'Last name is invalid');
                            cy.getRegistrationButton()
                                .should('be.disabled')
                        });
                    });
                });

                // Requirements say that spaces should be ignored, trim methon should be used => FAIL, marked as bug
                it('Should ignores spaces in Name field and pass registration', { tags: ['@bug']}, () => {
                    const field = 'signupName';
                    cy.get('@registrationData').then((registrationData) => {
                        const valuesWithSpaces = registrationData.namesWithSpaces;
                        valuesWithSpaces.forEach(value => {
                            cy.fillRegistrationForm({ overrides: { [field]: value } });
                            cy.getErrorMessage(field)
                                .should('not.exist');
                            cy.getRegistrationField(field)
                                .should('not.have.class', 'is-invalid');
                            cy.getRegistrationButton()
                                .should('be.enabled')
                        });
                    });
                });

                // Requirements say that spaces should be ignored, trim methon should be used => FAIL, marked as bug
                it('Should ignores spaces in Last name field and pass registration', {tags: ['@bug']}, () => {
                    const field = 'signupLastName';
                    cy.get('@registrationData').then((registrationData) => {
                        const valuesWithSpaces = registrationData.lastNamesWithSpaces;
                        valuesWithSpaces.forEach(value => {
                            cy.fillRegistrationForm({ overrides: { [field]: value } });
                            cy.getErrorMessage(field)
                                .should('not.exist');
                            cy.getRegistrationField(field)
                                .should('not.have.class', 'is-invalid');
                            cy.getRegistrationButton()
                                .should('be.enabled')
                        });
                    });
                });
            });
        });

        describe('Email field validation', () => {
            it('Should show validation messages when Email field has invalid email formats', () => {
                const field = 'signupEmail';
                cy.get('@registrationData').then((registrationData) => {
                    const invalidValues = registrationData.invalidEmails;
                    invalidValues.forEach(value => {
                        cy.fillRegistrationForm({ overrides: { [field]: value } });
                        expectInvalidFieldAndErrorMessage(field, 'Email is incorrect');
                        cy.getRegistrationButton()
                            .should('be.disabled')
                    });
                });
            });
        });

        describe('Password and Repeat Password fields validation', () => {
            describe('Password length validation, check boundaries', () => {
                it('Should show validation messages when Password field has invalid length', () => {
                    const field = 'signupPassword';
                    const errorMessage = 'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
                    const cases = [
                        { value: 'Short67', valid: false, message: errorMessage },
                        { value: 'EqEight8', valid: true },
                        { value: 'Aa3'.repeat(5), valid: true },
                        { value: 'Aa3'.repeat(5) + '1', valid: false, message: errorMessage },
                    ];
                    cases.forEach(({ value, valid, message }) => {
                        cy.fillRegistrationForm({ overrides: { [field]: value } });
                        if (!valid) {
                            expectInvalidFieldAndErrorMessage(field, message);
                            cy.getRegistrationButton()
                                .should('be.disabled')
                        } else {
                            cy.getErrorMessage(field)
                                .should('not.exist');
                            cy.getRegistrationField(field)
                                .should('not.have.class', 'is-invalid');
                        }
                    });
                });
            });

            describe('Passwordі complexity validation', () => {
                it('Should show validation messages when Password and Repeat Password fields have invalid complexity', () => {
                    const passwordField = 'signupPassword';
                    const repeatPasswordField = 'signupRepeatPassword';
                    const errorMessage = 'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
                    cy.get('@registrationData').then((registrationData) => {
                        const invalidValues = registrationData.invalidPasswords;
                        invalidValues.forEach(value => {
                            cy.fillRegistrationForm({ overrides: {
                                [passwordField]: value,
                                [repeatPasswordField]: value
                            } });
                            expectInvalidFieldAndErrorMessage(passwordField, errorMessage);
                            expectInvalidFieldAndErrorMessage(repeatPasswordField, errorMessage);
                            cy.getRegistrationButton()
                                .should('be.disabled')
                        });
                    });
                });
            });

            describe('Passwords match validation', () => {
                it('Should show validation message when Password and Repeat Password fields do not match', () => {
                    const errorMessage = 'Passwords do not match';
                    cy.fillRegistrationForm({ overrides: 
                        {
                            signupPassword: 'ValidPass1',
                            signupRepeatPassword: 'DifferentPass1'
                        } 
                    });
                    expectInvalidFieldAndErrorMessage('signupRepeatPassword', errorMessage);
                    cy.getRegistrationButton()
                        .should('be.disabled')
                });
            });
        });
    });
});