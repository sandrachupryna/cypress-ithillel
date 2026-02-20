Cypress.Commands.add('visitWithAuth', (url) => {
    cy.visit(url, {
      auth: {
        username: Cypress.env('username'),
        password: Cypress.env('password'),
      },
    });
})

Cypress.Commands.add('openHomePageAndLoginByBasicAuth', () => {
    cy.visitWithAuth('/');
});

Cypress.Commands.add('clickSignUpButton', () => {
    cy.get('.hero-descriptor_btn').click();
});

Cypress.Commands.add('getRegistrationField', (field) => 
    cy.get(`app-signup-form form #${field}`)
);

Cypress.Commands.add('fillLoginFormAndSubmit', (user) => {
    cy.openHomePageAndLoginByBasicAuth();
    cy.get('.header_right .header_signin').click();
    cy.get('app-signin-form #signinEmail').type(user.email);
    cy.get('app-signin-form #signinPassword').type(user.password, { sensitive: true});
    cy.get('app-signin-modal button').contains('Login').click();
});

Cypress.Commands.add('ensureUserExistsAndLoginViaSession', (user) => {
  cy.session(user.email, () => {
    cy.openHomePageAndLoginByBasicAuth();
    cy.clickSignUpButton();
    cy.fillRegistrationFormAndSubmit({ overrides: {
              signupName: user.name,
              signupLastName: user.lastName,
              signupEmail: user.email,
              signupPassword: user.password,
              signupRepeatPassword: user.password
        } 
      });

    cy.get('.alert').then(($body) => {
      if ($body.text().includes('User already exists')) {
        cy.log('User already created. Just login...');
        cy.get('.close').click();
        cy.fillLoginFormAndSubmit(user);
      } else {
        cy.log('User successfully created');
      }
    });

    cy.url().should('include', '/panel/garage');
  }, {
    validate() {
      cy.getCookie('sid').should('exist');
    },
    cacheAcrossSpecs: true
  });
});


Cypress.Commands.add('fillRegistrationForm', ({ overrides = {}, excludedField = null}) => {
    const id = Date.now();
    const validData = {
        signupName: `Name`,
        signupLastName: `LastName`,
        signupEmail: `email-${id}@test.com`,
        signupPassword: `Ps${id}`,
        signupRepeatPassword: `Ps${id}`,
        ...overrides
    };

  Object.entries(validData).forEach(([field, value]) => {
    if (field === excludedField) {
      cy.getRegistrationField(field).clear()
    } else if ( field === 'signupPassword' || field === 'signupRepeatPassword'){
      cy.getRegistrationField(field).clear().type(value, { sensitive: true });
    } else {
      cy.getRegistrationField(field).clear().type(value);
    }
  });

  cy.focused().blur();
  return cy.wrap(validData, { log: false });
});

Cypress.Commands.add('getRegistrationButton', () => {
    cy.get('app-signup-modal button').contains('Register');
});

Cypress.Commands.add('fillRegistrationFormAndSubmit', (overrides = {}) => {
  cy.fillRegistrationForm(overrides);
  cy.getRegistrationButton().click();
});

Cypress.Commands.add('getErrorMessage', (field) => {
    cy.get(`app-signup-form #${field}`).siblings('.invalid-feedback')
});

Cypress.Commands.add('getFieldLabel', (field) => {
    cy.get(`app-signup-form #${field}`).siblings('label')
});

Cypress.Commands.overwrite('type', (originalFn, element, text, options) => {
  if (options && options.sensitive) {
    // turn off original log
    options.log = false
    // create our own log with masked message
    Cypress.log({
      $el: element,
      name: 'type',
      message: '*'.repeat(text.length),
    })
  }

  return originalFn(element, text, options)
})

Cypress.Commands.add('saveCarId', (id) => {
  const ids = Cypress.env('createdCarIds') || [];
  ids.push(id);
  Cypress.env('createdCarIds', ids);
});

Cypress.Commands.add('clearSavedCarIds', () => {
  Cypress.env('createdCarIds', []);
});