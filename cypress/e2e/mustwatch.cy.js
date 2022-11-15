let upcomingMovies;
let movies;
let matchingMovies;
let movie1;
let movie3;

describe("The must watch feature", () => {

    before(() => {
        cy.request(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${Cypress.env("TMDB_KEY")}`
        )
        .its("body")
        .then((response) => {
            upcomingMovies = response.results
            .sort((m1, m2) => (
                (m1.popularity < m2.popularity) ? 1 : (m1.popularity > m2.popularity) ? -1 : 0));
        });
        cy.request(
            `https://api.themoviedb.org/3/discover/movie?api_key=${Cypress.env(
            "TMDB_KEY"
            )}&language=en-US&include_adult=false&include_video=false&page=1`
        )
            .its("body") // Take the body of HTTP response from TMDB
            .then((response) => {
            movies = response.results;
        });
    });

    beforeEach(() => {
        cy.visit("/movies/upcoming");
        matchingMovies = movies.filter((movie) => {
            return upcomingMovies.includes(movie) !== -1;
          });
    });

    describe("Selecting must watch", () => {
        it("selected movie card shows the playlist icon", () => {
            cy.get(".MuiCardHeader-root").eq(1).find("svg").should("not.exist");
            cy.get("button[aria-label='add to must watch']").eq(1).click();
            cy.get(".MuiCardHeader-root").eq(1).find("svg").should('have.attr', 'data-testid', 'PlaylistAddIcon');
        });

        it("selected movie card shows the heart icon if movie is already added to favourites", () => {
            //Favourite a Movie
            cy.get("button").contains("Home").click();
            cy.get(".MuiGrid-root.MuiGrid-item").contains(matchingMovies[1].title)
                .parentsUntil(".MuiGrid-root.MuiGrid-item")
                .find("button[aria-label='add to favorites']").click();
            cy.get(".MuiCardHeader-root").contains(matchingMovies[1].title)
                .parentsUntil(".MuiPaper-root").find("svg").should('have.attr', 'data-testid', 'FavoriteIcon');

            //Add movie to must watch
            cy.get("button").contains("Upcoming").click();
            cy.get(".MuiGrid-root.MuiGrid-item").contains(matchingMovies[1].title)
                .parentsUntil(".MuiGrid-root.MuiGrid-item")
                .find("button[aria-label='add to must watch']").click();
            cy.get(".MuiCardHeader-root").contains(matchingMovies[1].title)
                .parentsUntil(".MuiPaper-root").find("svg").should('have.attr', 'data-testid', 'FavoriteIcon');
        });

        it("selected movie card shows the playlist icon first, but is replaced by heart icon when added to favourites", () => {
            //Add movie to must watch
            cy.get(".MuiGrid-root.MuiGrid-item").contains(matchingMovies[1].title)
                .parentsUntil(".MuiGrid-root.MuiGrid-item")
                .find("button[aria-label='add to must watch']").click();
            cy.get(".MuiCardHeader-root").contains(matchingMovies[1].title)
                .parentsUntil(".MuiPaper-root").find("svg").should('have.attr', 'data-testid', 'PlaylistAddIcon');

            //Favourite a Movie
            cy.visit("/");
            cy.get(".MuiGrid-root.MuiGrid-item").contains(matchingMovies[1].title)
                .parentsUntil(".MuiGrid-root.MuiGrid-item")
                .find("button[aria-label='add to favorites']").click();
            cy.get(".MuiCardHeader-root").contains(matchingMovies[1].title)
                .parentsUntil(".MuiPaper-root").find("svg").should('have.attr', 'data-testid', 'FavoriteIcon');
        });

        it("selected movie cards that are also favourites appear in both the favourites page and the must watch page", () => {
            //Add movie to must watch
            cy.get(".MuiGrid-root.MuiGrid-item").contains(matchingMovies[1].title)
                .parentsUntil(".MuiGrid-root.MuiGrid-item")
                .find("button[aria-label='add to must watch']").click();

            //Favourite the same movie
            cy.get("button").contains("Home").click();
            cy.get(".MuiGrid-root.MuiGrid-item").contains(matchingMovies[1].title)
                .parentsUntil(".MuiGrid-root.MuiGrid-item")
                .find("button[aria-label='add to favorites']").click();

            //Check the movie is on the favourites page
            cy.get("button").contains("Favorites").click();
            cy.get(".MuiCardHeader-content").contains(matchingMovies[1].title);
            //Check the movie is on the must watch page
            cy.get("button").contains("Must Watch").click();
            cy.get(".MuiCardHeader-content").contains(matchingMovies[1].title);
        });
    });

    describe("The must watch page", () => {
        beforeEach(() => {
            // Necessary to get more accurate vote averages, as displayed on the must watch page
            cy.request(
                `https://api.themoviedb.org/3/movie/${
                    upcomingMovies[1].id
                }?api_key=${Cypress.env("TMDB_KEY")}`
                )
                .its("body")
                .then((movieDetails) => {
                    movie1 = movieDetails;
                });

            cy.request(
                `https://api.themoviedb.org/3/movie/${
                    upcomingMovies[3].id
                }?api_key=${Cypress.env("TMDB_KEY")}`
                )
                .its("body")
                .then((movieDetails) => {
                    movie3 = movieDetails;
                });
            // Select two to add to must watch and navigate to Must Watch page
            cy.get("button[aria-label='add to must watch']").eq(1).click();
            cy.get("button[aria-label='add to must watch']").eq(3).click();
            cy.get("button").contains("Must Watch").click();
        });

        it("only the tagged movies are listed, sorted by popularity", () => {
            cy.get(".MuiCardHeader-content").should("have.length", 2);
            var title1 = upcomingMovies[1].title.replace( /\s\s+/g, ' ' );
            var title3 = upcomingMovies[3].title.replace( /\s\s+/g, ' ' );

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
                var poster = "https://image.tmdb.org/t/p/w500/" + upcomingMovies[1].poster_path;
                cy.get(".MuiCardMedia-root").should('have.attr', 'style', 'background-image: url("' + poster + '");');

                //Confirm Release Date and Rating are correct
                var release = upcomingMovies[1].release_date;
                var rating = movie1.vote_average;
                if (cy.get(".MuiCardContent-root").should('contain', release).and('contain', rating));

                //Confirm Remove Button and More Info button are rendered
                cy.get(".MuiCardActions-root").within(() => {
                    cy.get('button').should('have.attr', 'aria-label', 'remove from must watch');
                    cy.get('a').should('have.attr', 'href', '/movies/' + upcomingMovies[1].id)
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
                var poster = "https://image.tmdb.org/t/p/w500/" + upcomingMovies[3].poster_path;
                cy.get(".MuiCardMedia-root").should('have.attr', 'style', 'background-image: url("' + poster + '");');

                //Confirm Release Date and Rating are correct
                var release = upcomingMovies[3].release_date;
                var rating = movie3.vote_average;
                cy.get(".MuiCardContent-root").should('contain', release).and('contain', rating);

                //Confirm Remove Button, Review Button, and More Info button are rendered
                cy.get(".MuiCardActions-root").within(() => {
                    cy.get('button').should('have.attr', 'aria-label', 'remove from must watch');
                    cy.get('a').should('have.attr', 'href', '/movies/' + upcomingMovies[3].id)
                        .and('contain', 'More Info ...');
                });
            });
        })

        it("movies are removed from must watch", () => {
            //Press the Delete Button
            cy.get(".MuiCardActions-root")
                .eq(0)
                .find("button[aria-label='remove from must watch']")
                .click();

            //Verify it has been removed from the page
            cy.get(".MuiCardHeader-content").should("have.length", 1);
            cy.get(".MuiCardHeader-content")
                .eq(0)
                .find("p")
                .should('not.contain', upcomingMovies[1].title)
                .and('contain', upcomingMovies[3].title);

        });
    });
});