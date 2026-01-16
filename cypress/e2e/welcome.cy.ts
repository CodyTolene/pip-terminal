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
            cy.contains('h4', 'NEW').should('be.visible');
          });
        cy.get('.note')
          .scrollIntoView()
          .contains('Coming soon')
          .should('be.visible');
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
          });
        cy.get('.note')
          .scrollIntoView()
          .contains('Coming soon')
          .should('be.visible');
        cy.get('.note')
          .scrollIntoView()
          .contains('Partially Completed')
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

  it('opens external links with pip buttons via window.open', () => {
    cy.window().then((win) => cy.stub(win, 'open').as('winOpen'));

    // Become a contributor button
    cy.contains('pip-button', 'Become A Contributor!').scrollIntoView().click();
    cy.get('@winOpen').should(
      'have.been.calledWith',
      'https://github.com/CodyTolene/pip-boy-apps',
      '_blank',
    );

    // Discord button
    cy.contains('pip-button', 'Join the Wasteland Discord!')
      .scrollIntoView()
      .click();
    cy.get('@winOpen').should(
      'have.been.calledWith',
      'https://discord.gg/zQmAkEg8XG',
      '_blank',
    );
  });
});
