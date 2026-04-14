describe('Home page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders the new intro section and opens intro actions', () => {
    cy.get('section[welcome-intro]').within(() => {
      cy.contains('h1', 'User Terminal').should('be.visible');
      cy.contains('h3', 'Vault Mainframe Accessed').should('be.visible');
      cy.contains(
        'p',
        'Welcome back, Vault Dweller. Your Pip-Boy is ready.',
      ).should('be.visible');

      cy.contains('pip-button', 'Forum')
        .scrollIntoView()
        .click({ force: true });
    });

    cy.location('pathname').should('eq', '/forum');
    cy.go('back');

    cy.window().then((win) => cy.stub(win, 'open').as('winOpen'));

    cy.get('section[welcome-intro]').within(() => {
      cy.contains('pip-button', 'Discord')
        .scrollIntoView()
        .click({ force: true });
      cy.contains('pip-button', 'GitHub')
        .scrollIntoView()
        .click({ force: true });
    });

    cy.get('@winOpen').should(
      'have.been.calledWith',
      'https://discord.gg/zQmAkEg8XG',
      '_blank',
    );
    cy.get('@winOpen').should(
      'have.been.calledWith',
      'https://github.com/CodyTolene/pip-terminal',
      '_blank',
    );
  });

  it('renders the Pip-Boy model selector with expected cards and links', () => {
    cy.get('section[welcome-pip-boys]').within(() => {
      cy.contains('p', 'Select a model below to begin.').should('be.visible');

      cy.get('div[role="navigation"][aria-label="Pip-Boy Selector"]')
        .as('selector')
        .within(() => {
          cy.get('.pip-grid-item.terminal-card').should('have.length', 6);
          cy.get('[aria-disabled="true"]').should('have.length', 3);
          cy.contains('h4', 'Pip-Boy 3000').should('be.visible');
          cy.contains('h4', 'Pip-Boy 3000A').should('be.visible');
          cy.contains('h4', 'Pip-Boy 3000 Mk IV*').should('be.visible');
          cy.contains('h4', 'Pip-Boy 2000 Mk VI*').should('be.visible');
          cy.contains('h4', 'Pip-Boy 3000 Mk V').should('be.visible');
          cy.contains('h4', 'Pip-Boy 3000*').should('be.visible');

          cy.contains('a.pip-grid-item', 'Pip-Boy 3000').should(
            'have.attr',
            'href',
            'https://lambda.guru/software/pip-boy/3000',
          );
          cy.contains('a.pip-grid-item', 'Pip-Boy 3000A').should(
            'have.attr',
            'href',
            'https://lambda.guru/software/pip-boy/3000a',
          );
          cy.contains('a.pip-grid-item', 'Pip-Boy 3000 Mk V')
            .scrollIntoView()
            .click({ force: true });
        });
    });

    cy.location('pathname').should('eq', '/3000-mk-v');
  });

  it('shows community rosters with expected member counts', () => {
    cy.get('section[welcome-community]').within(() => {
      cy.contains('h1', 'Community').should('be.visible');
      cy.contains('h3', 'Vault Roster').should('be.visible');
      cy.contains(
        'p',
        'Built by wastelanders, kept alive by the community.',
      ).should('be.visible');

      cy.get('div[aria-label="Community Members"]').should('have.length', 2);
      cy.get('div[aria-label="Community Members"]')
        .eq(0)
        .find('pip-vault-tec-user-card')
        .should('have.length', 8);
      cy.get('div[aria-label="Community Members"]')
        .eq(1)
        .find('pip-vault-tec-user-card')
        .should('have.length', 16);

      cy.contains('h4', 'Gordon Williams')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('h4', 'Matchwood').should('be.visible');
    });
  });

  it('renders role requirements and links to the correct destinations', () => {
    cy.get('section[welcome-roles]').within(() => {
      cy.contains('h3', 'How to Earn a Role in the Vault')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('h4', 'Atomic Sponsor').should('be.visible');
      cy.contains('h4', 'Vault-Tec Engineer').should('be.visible');
      cy.contains('h4', 'Vault-Tec Security & Support').should('be.visible');
      cy.contains('h4', 'Discord Server Booster').should('be.visible');

      cy.contains('a', 'Sponsor this website').should(
        'have.attr',
        'href',
        'https://github.com/sponsors/CodyTolene',
      );
      cy.contains('a', 'Contribute to the website').should(
        'have.attr',
        'href',
        'https://github.com/CodyTolene/pip-terminal',
      );
      cy.contains('a', 'Design an app or game').should(
        'have.attr',
        'href',
        'https://github.com/CodyTolene/pip-boy-3000-mk-v-apps',
      );
      cy.contains('a', 'Join Discord & Help the Community').should(
        'have.attr',
        'href',
        'https://discord.gg/zQmAkEg8XG',
      );
      cy.contains('a', 'Boost the Community Discord Server').should(
        'have.attr',
        'href',
        'https://discord.gg/zQmAkEg8XG',
      );

      cy.contains(
        'p.crew',
        'Special role holders receive automatic access to',
      ).should('be.visible');
      cy.contains('p.crew span', '#vault-tec-crew').should('be.visible');
    });

    cy.get('pip-footer').should('exist');
  });
});
