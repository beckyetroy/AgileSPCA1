import { sortItemsLargeFirst } from "../support/e2e";

let movies; // List of movies from TMDB
let sorted_movies; // List of movies after they've been sorted accordingly

describe("Base tests for pages with multiple movies", () => {

    before(() => {
        // Get the discover movies from TMDB and store them locally.
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
        cy.visit("/");
        sorted_movies = sortItemsLargeFirst(movies, "popularity");
    });

    describe("The Discover Movies page", () => {
        it("displays the page header and 7 movies on first load", () => {
            cy.get("h3").contains("Discover Movies");
            cy.get(".MuiCardHeader-root").should("have.length", 7);
        });

        it("displays the 'Filter Movies' card and all relevant filter/sort fields", () => {
            cy.get(".MuiGrid-root.MuiGrid-container")
            .eq(1)
            .find(".MuiGrid-root.MuiGrid-item")
            .eq(0)
            .within(() => {
                cy.get("h1").contains("Filter Movies");
                //Check if Input and Select fields are as expected
                cy.get("[id='filled-search']").should('have.class',
                    "MuiInputBase-input MuiFilledInput-input MuiInputBase-inputTypeSearch");
                cy.get("[id='genre-select']").should('have.class',
                    "MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused");
                cy.get("[id='sort-select']").should('have.class', "MuiSelect-select MuiSelect-outlined MuiInputBase-input MuiOutlinedInput-input")
                //Check if Movies are sorted by popularity by default
                .contains("Popularity");
            });
        })

        describe("Movie Information", () => {
            it("displays the correct movie titles", () => {
                cy.verifyMovieTitles(sorted_movies);
            });

            it("displays the correct movie posters", () => {
                cy.verifyMoviePosters(sorted_movies);
            });

            it("displays the correct release date and rating", () => {
                cy.verifyReleaseRating(sorted_movies);
            });

            it("displays the 'Add to Favourites' and 'More Info' Buttons", () => {
                cy.get(".MuiCardActions-root").each(($card, index) => {
                    cy.wrap($card).find('button').should('have.attr', 'aria-label', 'add to favorites');
                    cy.wrap($card).find('a').should('have.attr', 'href', '/movies/' + sorted_movies[index].id)
                        .and('contain', 'More Info ...');
                });
            });
        });
    });

    describe("The Favorites page", () => {
        beforeEach(() => {
            cy.visit("/movies/favorites");
        });

        it("displays the page header", () => {
            cy.get("h3").contains("Favorite Movies");
        });

        it("displays the 'Filter Movies' card and all relevant filter/sort fields", () => {
            cy.get(".MuiGrid-root.MuiGrid-container")
            .eq(1)
            .find(".MuiGrid-root.MuiGrid-item")
            .eq(0)
            .within(() => {
                cy.get("h1").contains("Filter Movies");
                //Check if Input and Select fields are as expected
                cy.get("[id='filled-search']").should('have.class',
                    "MuiInputBase-input MuiFilledInput-input MuiInputBase-inputTypeSearch");
                cy.get("[id='genre-select']").should('have.class',
                    "MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused");
                cy.get("[id='sort-select']").should('have.class', "MuiSelect-select MuiSelect-outlined MuiInputBase-input MuiOutlinedInput-input")
                //Check if Movies are sorted by popularity by default
                .contains("Popularity");
            });
        });
    });

    describe("The Upcoming Movies page", () => {

        before(() => {
            cy.request(
            `https://api.themoviedb.org/3/movie/upcoming?api_key=${Cypress.env("TMDB_KEY")}`
            )
            .its("body")
            .then((response) => {
            movies = response.results;
            });
        });

        beforeEach(() => {
            cy.visit("/movies/upcoming");
            sorted_movies = sortItemsLargeFirst(movies, "popularity");
        });

        it("displays the page header and 7 movies on first load", () => {
            cy.get("h3").contains("Upcoming Movies");
            cy.get(".MuiCardHeader-root").should("have.length", 7);
        });

        it("displays the 'Filter Movies' card and all relevant filter/sort fields", () => {
            cy.get(".MuiGrid-root.MuiGrid-container")
            .eq(1)
            .find(".MuiGrid-root.MuiGrid-item")
            .eq(0)
            .within(() => {
                cy.get("h1").contains("Filter Movies");
                //Check if Input and Select fields are as expected
                cy.get("[id='filled-search']").should('have.class',
                    "MuiInputBase-input MuiFilledInput-input MuiInputBase-inputTypeSearch");
                cy.get("[id='genre-select']").should('have.class',
                    "MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused");
                cy.get("[id='sort-select']").should('have.class', "MuiSelect-select MuiSelect-outlined MuiInputBase-input MuiOutlinedInput-input")
                //Check if Movies are sorted by popularity by default
                .contains("Popularity");
            });
        });

        describe("Movie Information", () => {
            it("displays the correct movie titles", () => {
                cy.verifyMovieTitles(sorted_movies);
            });

            it("displays the correct movie posters", () => {
                cy.verifyMoviePosters(sorted_movies);
            });

            it("displays the correct release dates and ratings", () => {
                cy.verifyReleaseRating(sorted_movies);
            });

            it("displays the 'Add to Must Watch' and 'More Info' buttons", () => {
                cy.get(".MuiCardActions-root").each(($card, index) => {
                    cy.wrap($card).find('button').should('have.attr', 'aria-label', 'add to must watch');
                    cy.wrap($card).find('a').should('have.attr', 'href', '/movies/' + sorted_movies[index].id)
                        .and('contain', 'More Info ...');
                });
            });
        });
    });

    describe("The Must Watch page", () => {
        beforeEach(() => {
            cy.visit("/movies/mustwatch");
        });

        it("displays the page header", () => {
            cy.get("h3").contains("Your Must-Watch Movies");
        });

        it("displays the 'Filter Movies' card and all relevant filter/sort fields", () => {
            cy.get(".MuiGrid-root.MuiGrid-container")
            .eq(1)
            .find(".MuiGrid-root.MuiGrid-item")
            .eq(0)
            .within(() => {
                cy.get("h1").contains("Filter Movies");
                //Check if Input and Select fields are as expected
                cy.get("[id='filled-search']").should('have.class',
                    "MuiInputBase-input MuiFilledInput-input MuiInputBase-inputTypeSearch");
                cy.get("[id='genre-select']").should('have.class',
                    "MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused");
                cy.get("[id='sort-select']").should('have.class', "MuiSelect-select MuiSelect-outlined MuiInputBase-input MuiOutlinedInput-input")
                //Check if Movies are sorted by popularity by default
                .contains("Popularity");
            });
        });
    });

    describe("The Trending page", () => {
        before(() => {
            cy.request(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=${Cypress.env("TMDB_KEY")}`
            )
            .its("body")
            .then((response) => {
            movies = response.results;
            });
        });

        beforeEach(() => {
            cy.visit("/movies/trending/week");
            sorted_movies = sortItemsLargeFirst(movies, "popularity");
        });

        it("displays the page header", () => {
            cy.get("h3").contains("Trending This Week");
        });

        it("displays the 'Filter Movies' card and all relevant filter/sort fields", () => {
            cy.get(".MuiGrid-root.MuiGrid-container")
            .eq(1)
            .find(".MuiGrid-root.MuiGrid-item")
            .eq(0)
            .within(() => {
                cy.get("h1").contains("Filter Movies");
                //Check if Input and Select fields are as expected
                cy.get("[id='filled-search']").should('have.class',
                    "MuiInputBase-input MuiFilledInput-input MuiInputBase-inputTypeSearch");
                cy.get("#time-select").should('have.class', "MuiSelect-select MuiSelect-outlined MuiInputBase-input MuiOutlinedInput-input")
                //Check if Trending is set to this week
                .contains("This Week");
                cy.get("[id='genre-select']").should('have.class',
                    "MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused");
                cy.get("[id='sort-select']").should('have.class', "MuiSelect-select MuiSelect-outlined MuiInputBase-input MuiOutlinedInput-input")
                //Check if Movies are sorted by popularity by default
                .contains("Popularity");
            });
        });

        it("displays the correct movie titles", () => {
            cy.verifyMovieTitles(sorted_movies);
        });

        describe("Movie Information", () => {
            it("displays the correct movie posters", () => {
                cy.verifyMoviePosters(sorted_movies);
            });

            it("displays the correct release dates and ratings", () => {
                cy.verifyReleaseRating(sorted_movies);
            });

            it("displays the 'Add to Favourites' and 'More Info' buttons", () => {
                cy.get(".MuiCardActions-root").each(($card, index) => {
                    cy.wrap($card).find('button').should('have.attr', 'aria-label', 'add to favorites');
                    cy.wrap($card).find('a').should('have.attr', 'href', '/movies/' + sorted_movies[index].id)
                        .and('contain', 'More Info ...');
                });
            });
        });
    });
});