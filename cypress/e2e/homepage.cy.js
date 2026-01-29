describe('Check navigation on Homepage', () => {
    beforeEach(() => {
        cy.openHomePageAndLoginByBasicAuth();
    });

    describe('Check header', () => {
        it('Logo leads to the homepage', () => {
            cy.get('.header_left .header_logo')
                .should('exist')
                .should('be.visible')
                .should('not.be.disabled')
                .should('have.attr', 'href', '/')
        });
        it('Home button leads to the homepage', () => {
            cy.get('.header_left .header_nav')
                .contains('a', 'Home')
                .should('exist')
                .should('be.visible')
                .should('have.attr', 'href', '/')
        });
        
        it('About button leads to the "about" section', () => {
            cy.get('.header_left .header_nav')
                .contains('button', 'About')
                .should('exist')
                .should('be.enabled')
                .should('have.attr', 'appscrollto', 'aboutSection')
        });
        it('Contacts button leads to the "contacts" section', () => {
            cy.get('.header_left .header_nav')
                .contains('button', 'Contacts')
                .should('exist')
                .should('be.enabled')
                .should('have.attr', 'appscrollto', 'contactsSection')
        });

        it('Check the "Guest login" button', () => {
            cy.get('.header_right')
                .contains('button', 'Guest log in')
                .should('exist')
                .should('have.class', '-guest')
        });


        it('Check the "Sign in" button', () => {
            cy.get('.header_right .header_signin')
                .should('exist')
                .should('be.visible')
                .should('not.be.disabled')
                .should('have.text', 'Sign In')
        });
    });
    
    describe('Check the main section', () => {
        it('Check the Sign Up button', () => {
            cy.get('.hero-descriptor_btn')
                .should('exist')
                .should('be.visible')
                .should('not.be.disabled')
                .should('have.text', 'Sign up');
        });
    });

    describe('Check the footer', () => {
        it('Facebook icon leads to the Facebook page', () => {
            cy.get('#contactsSection .icon-facebook')
                .closest('a')
                .should('have.attr', 'href')
                .and('include', 'facebook.com');
            });

        it('Telegram icon leads to the Telegram', () => {
            cy.get('#contactsSection .icon-telegram')
                .closest('a')
                .should('have.attr', 'href')
                .and('include', 't.me');
            });
        it('YouTube icon leads to the YouTube page', () => {
            cy.get('#contactsSection .icon-youtube')
                .closest('a')
                .should('have.attr', 'href')
                .and('include', 'youtube.com');
            });

        it('Instagram icon leads to the Instagram page', () => {
            cy.get('#contactsSection .icon-instagram')
                .closest('a')
                .should('have.attr', 'href')
                .and('include', 'instagram.com');
            });

        it('LinkedIn icon leads to the LinkedIn page', () => {
            cy.get('#contactsSection .icon-linkedin')
                .closest('a')
                .should('have.attr', 'href')
                .and('include', 'linkedin.com');
            });
        
        it('Check the site contact ', () => {
            cy.get('#contactsSection')
              .contains('a.contacts_link', 'ithillel.ua')
              .should('have.attr', 'href')
              .and('include', 'https://ithillel.ua')
            });
        
        it('Check the mail contact ', () => {
            cy.get('#contactsSection')
              .contains('a.contacts_link', 'support@ithillel.ua')
              .should('have.attr', 'href')
              .and('include', 'mailto:developer@ithillel.ua')
            });
    });
});