import { filterByGenre, filterByTitle, filterByCharacter, filterByJob, filterByName } from "../support/e2e";

let movies; // List of Discover movies from TMDB
let sorted_movies; // List of movies after they've been sorted accordingly

describe("Filtering", () => {
    before(() => {
        // Get movies from TMDB and store them locally.
        cy.request(
            `https://api.themoviedb.org/3/discover/movie?api_key=${Cypress.env(
            "TMDB_KEY"
            )}&language=en-US&include_adult=false&include_video=false&page=1`
        )
            .its("body")
            .then((response) => {
            movies = response.results;
            });
        });

    describe("The Discover Movies page", () => {

        beforeEach(() => {
            cy.visit("/");
            sorted_movies = movies.sort((m1, m2) => (
                (m1.popularity < m2.popularity) ? 1 : (m1.popularity > m2.popularity) ? -1 : 0
            ));
        });

        describe("By movie title", () => {
            it("only display movies with 'm' in the title", () => {
                const searchString = "m";
                const matchingMovies = filterByTitle(sorted_movies, searchString);
                cy.get("#filled-search").clear().type(searchString); // Enter m in text box
                if (matchingMovies) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                        cy.wrap($card).find("p").contains('m', {matchCase: false});
                    });
                }
                else cy.get(".MuiCardHeader-content").should("have.length", 0);
            });

            it("displays nothing when no movies match", () => {
                const searchString = "xxxzy";
                cy.get("#filled-search").clear().type(searchString); // Enter m in text box
                cy.get(".MuiCardHeader-content").should("have.length", 0);
            });
        });

        describe("By movie genre", () => {
            it("displays movies with one selected genre", () => {
                const selectedGenres = [{"id":12,"name":"Adventure"}];
                const genreIds = selectedGenres.map(genre => genre.id);
                const matchingMovies = filterByGenre(sorted_movies, genreIds);
                //Select Adventure
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                if (matchingMovies) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
                else cy.get(".MuiCardHeader-content").should("have.length", 0);
            });

            it("displays movies with multiple selected genres", () => {
                const selectedGenres = [
                    {"id":12,"name":"Adventure"},
                    {"id":35,"name":"Comedy"}
                ];
                const genreIds = selectedGenres.map(genre => genre.id);
                const matchingMovies = filterByGenre(sorted_movies, genreIds);
                //Select Comedy
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="3"]').click();
                //Select Adventure
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                if (matchingMovies) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
                else cy.get(".MuiCardHeader-content").should("have.length", 0);
            });

            it("clears one genre filter correctly", () => {
                const selectedGenres = [
                    {"id":12,"name":"Adventure"}
                ];
                const genreIds = selectedGenres.map(genre => genre.id);
                const matchingMovies = filterByGenre(sorted_movies, genreIds);
                //Select Comedy
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="3"]').click();
                //Select Adventure
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                //Clear the Comedy filter
                cy.get("svg").eq(3).should('have.attr', 'data-testid', 'CancelIcon').click();
                //Check cards are only filtered by adventure genre now
                if (matchingMovies) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
            });

            it("clears all genre filters when removed one by one", () => {
                //Select Comedy
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="3"]').click();
                //Select Adventure
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                //Clear the filters
                cy.get(".MuiAutocomplete-root").find('svg').eq(0).should('have.attr', 'data-testid', 'CancelIcon').click();
                cy.get(".MuiAutocomplete-root").find('svg').eq(0).should('have.attr', 'data-testid', 'CancelIcon').click();
                //Check cards have no filter applied
                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    cy.wrap($card).find("p").contains(sorted_movies[index].title);
                });
            });

            it("clears all genre filters when removed all at once", () => {
                //Select Comedy
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="3"]').click();
                //Select Adventure
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                //Clear the filters
                cy.get(".MuiAutocomplete-endAdornment").find('button').eq(0).click();
                //Check cards have no filter applied
                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    cy.wrap($card).find("p").contains(sorted_movies[index].title);
                });
            });
        });

        describe("By movie title and genre", () => {
            it("only display movies with 'c' in the title within the selected genre", () => {
                //Add genre filter
                const selectedGenres = [{"id":12,"name":"Adventure"}];
                const genreIds = selectedGenres.map(genre => genre.id);
                const matchingMoviesGenre = filterByGenre(sorted_movies, genreIds);
                //Select Adventure
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                //Add title filter
                const searchString = "c";
                const matchingMovies = filterByTitle(matchingMoviesGenre, searchString);
                cy.get("#filled-search").clear().type(searchString); // Enter c in text box
                if (matchingMovies) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
                else cy.get(".MuiCardHeader-content").should("have.length", 0);
            });
        });
    });
});