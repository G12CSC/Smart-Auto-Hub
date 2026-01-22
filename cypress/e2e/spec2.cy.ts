describe('template spec', () => {
    it("allows user to book consultation", () => {
        cy.visit("/consultation");
        cy.get("input[name='date']").type("2026-02-01");
        cy.contains("Book").click();
        cy.contains("Booking successful");
    });

})