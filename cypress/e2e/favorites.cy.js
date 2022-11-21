import { sortItemsLargeFirst } from "../support/e2e";

let movies;
let movie;
let movieimgs;
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
                movies = sortItemsLargeFirst(response.results, "popularity");
            });
    });

    beforeEach(() => {
        cy.visit("/");
    });

    describe("Selecting favourites", () => {
        it("selected movie card shows the red heart", () => {
            cy.get(".MuiCardHeader-root").eq(1).find("svg").should("not.exist");
            cy.get("button[aria-label='add to favorites']").eq(1).click();
            cy.get(".MuiCardHeader-root").eq(1).find("svg").should('have.attr', 'data-testid', 'FavoriteIcon');
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

describe("The 'write review' feature", () => {
    before(() => {
        cy.request(
            `https://api.themoviedb.org/3/discover/movie?api_key=${Cypress.env(
            "TMDB_KEY"
            )}&language=en-US&include_adult=false&include_video=false&page=1`
        )
            .its("body") // Take the body of HTTP response from TMDB
            .then((response) => {
            movies = response.results;
            });

        cy.request(
            `https://api.themoviedb.org/3/movie/${
                movies[1].id
            }?api_key=${Cypress.env("TMDB_KEY")}`
            )
            .its("body")
            .then((movieDetails) => {
                movie = movieDetails;
            });

        cy.request(
            `https://api.themoviedb.org/3/movie/${
                movies[1].id
            }/images?api_key=${Cypress.env("TMDB_KEY")}`
            )
            .its("body")
            .then((movieImages) => {
                movieimgs = movieImages;
            });
    });

    beforeEach(() => {
        cy.visit("/");
        // Select a favourite and navigate to Favourites page
        cy.get("button[aria-label='add to favorites']").eq(1).click();
        cy.get("button").contains("Favorites").click();
        // Navigate to the 'write review' form
        cy.get('.MuiCardActions-root').find('svg').eq(1)
            .should('have.attr', 'data-testid', 'RateReviewIcon').click();
    });

    describe("Form base tests", () => {

        it("user is taken to review form page", () => {
            cy.url().should('eq', 'http://localhost:3000/reviews/form');
        });

        it("displays correct movie title, homepage link, and tagline", () => {
            cy.get("h3").should('contain', movie.title)
                .and('contain', movie.tagline)
                .find('a').should('have.attr', 'href', movie.homepage)
                .find('svg').should('have.attr', 'data-testid', 'HomeIcon');
        });

        it("displays the correct movie posters as a carousel", () => {
            cy.get(".MuiGrid-root")
                .eq(0)
                .find(".MuiGrid-root.MuiGrid-item")
                .eq(0)
                .within(() => {
                    var imgPath = movieimgs.posters.map((image) => image.file_path);
                    cy.get("div").find("img").each(($img, index) => {
                        cy.wrap($img).should('have.attr', 'src', 'https://image.tmdb.org/t/p/w500/' + imgPath[index]);
                    });
                });
        });

        it("displays the correct author, review, and rating input fields", () => {
            cy.get("#author").should('have.attr', 'type', 'text')
                .parent().find("span").should('contain', "Author's name");
            cy.get("textarea").should('have.attr', 'id', 'review')
                .parent().find("span").should('contain', "Review text");
            //6 rating options expected: 0, 1, 2, 3, 4, or 5 stars
            cy.get(".MuiRating-root").find("input").should("have.length", 6);
        });

        it("displays the submit and reset buttons", () => {
            cy.get(".MuiBox-root").find("button").eq(0)
                .should('have.attr', 'type', 'submit')
                .and('contain', 'Submit');
            cy.get(".MuiBox-root").find("button").eq(1)
                .should('have.attr', 'type', 'reset')
                .and('contain', 'Reset');
        });

        it("doesn't display any error messages before the submit button is pressed", () => {
            cy.contains("Name is required").should('not.exist');
            cy.contains("Review cannot be empty.").should('not.exist');
        });
    });

    describe("Form validation tests", () => {

        it("empty name and review fails to submit and displays 2 error messages", () => {
            cy.get(".MuiBox-root").find("button").eq(0).click();
            cy.get('form').then(
                ($form) => expect($form[0].checkValidity()).to.be.false,
            );
            cy.get('form').find("p").eq(0).contains("Name is required");
            cy.get('form').find("p").eq(1).contains("Review cannot be empty.");
        });

        it("empty name fails to submit and returns 1 error message", () => {
            cy.get("#review").type("This movie was brilliant!");
            cy.get(".MuiBox-root").find("button").eq(0).click();
            cy.get('form').then(
                ($form) => expect($form[0].checkValidity()).to.be.false,
            );
            cy.get('form').find("p").eq(0).contains("Name is required");
            cy.contains("Review cannot be empty.").should('not.exist');
        });

        it("empty review fails to submit and returns 1 error message", () => {
            cy.get("#author").type("Becky Troy");
            cy.get(".MuiBox-root").find("button").eq(0).click();
            cy.get('form').then(
                ($form) => expect($form[0].checkValidity()).to.be.false,
            );
            cy.get('form').find("p").eq(0).contains("Review cannot be empty.");
            cy.contains("Name is required").should('not.exist');
        });

        it("resets the form when reset button is clicked", () => {
            //Filling out the form
            cy.get("#author").type("Becky Troy");
            cy.get("#review").type("This movie was brilliant!");
            //Clearing the form
            cy.get(".MuiBox-root").find("button").eq(1).click();
            cy.get('#author').should('have.value', '');
            cy.get('#review').should('have.value', '');
        });

        describe("Valid form submission", () => {

            beforeEach(() => {
                cy.get("#author").type("Becky Troy");
                cy.get("#review").type("This movie was brilliant!");
                cy.get('.MuiRating-root').find('label').eq(4).click();
                cy.get(".MuiBox-root").find("button").eq(0).click();
            });

            it("form submits successfully without errors", () => {
                cy.get('form').then(
                    ($form) => expect($form[0].checkValidity()).to.be.true,
                );
                cy.contains("Name is required").should('not.exist');
                cy.contains("Review cannot be empty.").should('not.exist');
            });

            it("displays confirmation alert on valid form submit", () => {
                cy.get(".MuiAlert-icon");
                cy.get(".MuiAlert-message");
                cy.get(".MuiAlert-action");
            });

            it("redirects back to the favourites page when confirmation alert is dismissed", () => {
                cy.get(".MuiAlert-action").find('button').click();
                cy.url().should('eq', 'http://localhost:3000/movies/favorites');
            });
        });
    });
});