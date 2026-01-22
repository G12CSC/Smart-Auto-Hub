describe('Checking homepage with E2E testing', () => {
  it('should load the homepage!', () => {
    cy.visit('http://localhost:3000')
  })
})