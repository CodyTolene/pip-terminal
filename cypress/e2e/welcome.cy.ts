describe('Welcome page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders the hero, selector grids, and notes', () => {
    cy.get('main').within(() => {
      // Hero title (Intro)
      cy.contains('h1', 'Welcome to Pip-Boy.com!')
        .scrollIntoView()
        .should('be.visible');

      // Companions section grid
      cy.get('section[welcome-companions]').within(() => {
        cy.contains('h2', 'Pip-Boy Companion Terminals')
          .scrollIntoView()
          .should('be.visible');
        cy.get('div[role="navigation"][aria-label="Pip-Boy Selector"]')
          .as('companionSelector')
          .within(() => {
            cy.get('a.pip-grid-item').should('have.length', 2);
            cy.contains('h4', 'Pip-Boy 3000 Mk V')
              .scrollIntoView()
              .should('be.visible');
            cy.contains('h4', 'TBA').should('be.visible');
          });
        cy.get('.note').scrollIntoView().contains('TBA').should('be.visible');
        cy.get('.note').contains('Coming soon').should('be.visible');
      });

      // Simulation section grid
      cy.get('section[welcome-simulation]').within(() => {
        cy.contains('h2', 'Simulation Terminals')
          .scrollIntoView()
          .should('be.visible');
        cy.get('div[role="navigation"][aria-label="Pip-Boy Selector"]')
          .as('simulationSelector')
          .within(() => {
            cy.get('a.pip-grid-item').should('have.length', 4);
            cy.contains('h4', 'Pip-Boy 3000 Mk IV')
              .scrollIntoView()
              .should('be.visible');
            cy.contains('h4', 'WIP').should('be.visible');
            cy.contains('h4', 'TBA').should('be.visible');
          });
        cy.get('.note')
          .scrollIntoView()
          .contains('Coming soon')
          .should('be.visible');
        cy.get('.note')
          .scrollIntoView()
          .contains('Work in progress')
          .should('be.visible');
      });

      cy.get('section[welcome-community]').within(() => {
        cy.contains('h2', 'Community Support')
          .scrollIntoView()
          .should('be.visible');
      });
    });
  });

  it('navigates to /3000-mk-v when the Mk V tile is clicked', () => {
    cy.get(
      'section[welcome-companions] div[role="navigation"][aria-label="Pip-Boy Selector"]',
    )
      .contains('a.pip-grid-item', 'Pip-Boy 3000 Mk V')
      .click();

    cy.location('pathname').should('include', '/3000-mk-v');
    cy.go('back');
  });
});
