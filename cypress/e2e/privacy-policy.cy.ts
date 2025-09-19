describe('Privacy Policy Page', () => {
  it('should display the privacy policy heading and last updated text', () => {
    cy.visit('/privacy-policy');

    cy.contains('Privacy Policy').should('exist');

    cy.contains('Last updated').should('exist');
  });
});
