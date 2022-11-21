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

//Checks the correct movie titles are showing in a list page
Cypress.Commands.add('verifyMovieTitles', (movies) => {
    cy.get(".MuiCardHeader-content").each(($card, index) => {
        //Necessary to prevent errors when API returns double spacing.
        var title = movies[index].title.replace( /\s\s+/g, ' ' );
        cy.wrap($card).find("p").contains(title);
    });
});

//Checks the correct movie posters are showing in a list page
Cypress.Commands.add('verifyMoviePosters', (movies) => {
    cy.get(".MuiCardMedia-root").each(($card, index) => {
        var poster = "https://image.tmdb.org/t/p/w500/" + movies[index].poster_path;
        cy.wrap($card).should('have.attr', 'style', 'background-image: url("' + poster + '");');
    });
});

//Checks the correct movie release date and rating in a list page
Cypress.Commands.add('verifyReleaseRating', (movies) => {
    cy.get(".MuiCardContent-root").each(($card, index) => {
        var release = movies[index].release_date;
        var rating = movies[index].vote_average;
        cy.wrap($card).should('contain', release).and('contain', rating);
    });
});