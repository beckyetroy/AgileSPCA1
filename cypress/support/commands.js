// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//Add the movies at the specified indexes to favourites
Cypress.Commands.add('addToFavourites', (indexes) => {
    let i;
    for (i = 0; i < indexes.length; i++) {
        cy.get("button[aria-label='add to favorites']").eq(indexes[i]).click();
    }
});

//Add the movies at the specified indexes to must watch list
Cypress.Commands.add('addToMustWatch', (indexes) => {
    let i;
    for (i = 0; i < indexes.length; i++) {
        cy.get("button[aria-label='add to must watch']").eq(indexes[i]).click();
    }
});