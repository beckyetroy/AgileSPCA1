let movies;
let sorted_movies;
let movie1;
let movie3;

describe("The favourites feature", () => {

    before(() => {
        cy.request(
        `https://api.themoviedb.org/3/discover/movie?api_key=${Cypress.env(
            "TMDB_KEY"
        )}&language=en-US&include_adult=false&include_video=false&page=1`
        )
            .its("body")
            .then((response) => {
                movies = response.results
                .sort((m1, m2) => (
                    (m1.popularity < m2.popularity) ? 1 : (m1.popularity > m2.popularity) ? -1 : 0));
            });
    });

    beforeEach(() => {
        cy.visit("/");
    });

    describe("Selecting favourites", () => {
        it("selected movie card shows the red heart", () => {
            cy.get(".MuiCardHeader-root").eq(1).find("svg").should("not.exist");
            cy.get("button[aria-label='add to favorites']").eq(1).click();
            cy.get(".MuiCardHeader-root").eq(1).find("svg");
        });
    });

    describe("The favourites page", () => {
        beforeEach(() => {
            // Necessary to get more accurate vote averages, as displayed on the favourites page
            cy.request(
                `https://api.themoviedb.org/3/movie/${
                    movies[1].id
                }?api_key=${Cypress.env("TMDB_KEY")}`
                )
                .its("body")
                .then((movieDetails) => {
                    movie1 = movieDetails;
                });

            cy.request(
                `https://api.themoviedb.org/3/movie/${
                    movies[3].id
                }?api_key=${Cypress.env("TMDB_KEY")}`
                )
                .its("body")
                .then((movieDetails) => {
                    movie3 = movieDetails;
                });
            // Select two favourites and navigate to Favourites page
            cy.get("button[aria-label='add to favorites']").eq(1).click();
            cy.get("button[aria-label='add to favorites']").eq(3).click();
            cy.get("button").contains("Favorites").click();
        });

        it("only the tagged movies are listed, sorted by popularity", () => {
            cy.get(".MuiCardHeader-content").should("have.length", 2);
            var title1 = movies[1].title.replace( /\s\s+/g, ' ' );
            var title3 = movies[3].title.replace( /\s\s+/g, ' ' );

            cy.get(".MuiCardHeader-content")
                .eq(0)
                .find("p")
                .contains(title1);

            cy.get(".MuiCardHeader-content")
                .eq(1)
                .find("p")
                .contains(title3);
        });

        it("all movie details are displayed as expected", () => {
            //Confirm first movie details are correct
            cy.get(".MuiGrid-root.MuiGrid-container")
            .eq(1)
            .find(".MuiGrid-root.MuiGrid-item")
            .eq(1)
            .within(() => {
                //Confirm Poster is correct
                var poster = "https://image.tmdb.org/t/p/w500/" + movies[1].poster_path;
                cy.get(".MuiCardMedia-root").should('have.attr', 'style', 'background-image: url("' + poster + '");');

                //Confirm Release Date and Rating are correct
                var release = movies[1].release_date;
                var rating = movie1.vote_average;
                if (cy.get(".MuiCardContent-root").should('contain', release).and('contain', rating));

                //Confirm Remove Button, Review Button, and More Info button are rendered
                cy.get(".MuiCardActions-root").within(() => {
                    cy.get('button').should('have.attr', 'aria-label', 'remove from favorites');
                    cy.get('a').should('have.attr', 'href', '/reviews/form');
                    cy.get('a').next().should('have.attr', 'href', '/movies/' + movies[1].id)
                        .and('contain', 'More Info ...');
                });
            });

            //Confirm second movie details correct
            cy.get(".MuiGrid-root.MuiGrid-container")
            .eq(1)
            .find(".MuiGrid-root.MuiGrid-item")
            .eq(4)
            .within(() => {
                //Confirm Poster is correct
                var poster = "https://image.tmdb.org/t/p/w500/" + movies[3].poster_path;
                cy.get(".MuiCardMedia-root").should('have.attr', 'style', 'background-image: url("' + poster + '");');

                //Confirm Release Date and Rating are correct
                var release = movies[3].release_date;
                var rating = movie3.vote_average;
                cy.get(".MuiCardContent-root").should('contain', release).and('contain', rating);

                //Confirm Remove Button, Review Button, and More Info button are rendered
                cy.get(".MuiCardActions-root").within(() => {
                    cy.get('button').should('have.attr', 'aria-label', 'remove from favorites');
                    cy.get('a').should('have.attr', 'href', '/reviews/form');
                    cy.get('a').next().should('have.attr', 'href', '/movies/' + movies[3].id)
                        .and('contain', 'More Info ...');
                });
            });
        })

        it("movies are removed from favourites", () => {
            //Press the Delete Button
            cy.get(".MuiCardActions-root")
                .eq(0)
                .find("button[aria-label='remove from favorites']")
                .click();

            //Verify it has been removed from the page
            cy.get(".MuiCardHeader-content").should("have.length", 1);
            cy.get(".MuiCardHeader-content")
                .eq(0)
                .find("p")
                .should('not.contain', movies[1].title)
                .and('contain', movies[3].title);

        });
    });
});