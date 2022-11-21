import { sortItemsLargeFirst } from "../support/e2e";
import { filterByGenre, filterByTitle, filterByCharacter, filterByJob, filterByName } from "../support/e2e";

let movies; // List of Discover movies from TMDB
let sorted_movies; // List of movies after they've been sorted accordingly

let favorite_movies; // List of movies that have been added to favourites
let mustwatch_movies; // List of movies that have been added to must watch

let moviesweek; // List of movies trending this week
let sorted_movies_week; // List of trending movies this week after they've been sorted accordingly
let moviesday; // List of movies trending today
let sorted_movies_day; // List of trending movies today after they've been sorted accordingly

let cast; // List of cast members for a particular movie
let crew; //List of crew members for a particular movie
var seen = {}; //Used for filtering crew list (see crew list page tests)

//Very good filtering test!
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
            sorted_movies = sortItemsLargeFirst(movies, "popularity");
        });

        describe("By movie title", () => {
            it("only display movies with 'm' in the title", () => {
                const searchString = "m";
                const matchingMovies = filterByTitle(sorted_movies, searchString);
                cy.get("#filled-search").clear().type(searchString); // Enter m in text box
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                        cy.wrap($card).find("p").contains('m', {matchCase: false});
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist");
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
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist", 0);
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
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist", 0);
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
                if (matchingMovies.length > 0) {
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
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist", 0);
            });
        });
    });

    describe("The Favorites page", () => {

        beforeEach(() => {
            cy.visit("/");
            // Select 5 favourites and navigate to the favourites page
            cy.addToFavourites([0,1,5,3,6]);
            cy.get("button").contains("Favorites").click();
            sorted_movies = sortItemsLargeFirst(movies, "popularity");
            const favorite_ids = [0,1,5,3,6];
            favorite_movies = sorted_movies.filter(movie => favorite_ids.includes(sorted_movies.indexOf(movie)));
        });

        describe("By movie title", () => {
            it("only display movies with 'a' in the title", () => {
                const searchString = "a";
                const matchingMovies = filterByTitle(favorite_movies, searchString);
                console.log(matchingMovies);
                cy.get("#filled-search").clear().type(searchString); // Enter m in text box
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                        cy.wrap($card).find("p").contains('a', {matchCase: false});
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist",);
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
                const matchingMovies = filterByGenre(favorite_movies, genreIds);
                //Select Adventure
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist");
            });

            it("displays movies with multiple selected genres", () => {
                const selectedGenres = [
                    {"id":12,"name":"Adventure"},
                    {"id":35,"name":"Comedy"}
                ];
                const genreIds = selectedGenres.map(genre => genre.id);
                const matchingMovies = filterByGenre(favorite_movies, genreIds);
                //Select Comedy
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="3"]').click();
                //Select Adventure
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist");
            });

            it("clears one genre filter correctly", () => {
                const selectedGenres = [
                    {"id":12,"name":"Adventure"}
                ];
                const genreIds = selectedGenres.map(genre => genre.id);
                const matchingMovies = filterByGenre(favorite_movies, genreIds);
                //Select Comedy
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="3"]').click();
                //Select Adventure
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                //Clear the Comedy filter
                cy.get("svg").eq(3).should('have.attr', 'data-testid', 'CancelIcon').click();
                //Check cards are only filtered by adventure genre now
                if (matchingMovies.length > 0) {
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
                    cy.wrap($card).find("p").contains(favorite_movies[index].title);
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
                    cy.wrap($card).find("p").contains(favorite_movies[index].title);
                });
            });
        });

        describe("By movie title and genre", () => {
            it("only display movies with 'c' in the title within the selected genre", () => {
                //Add genre filter
                const selectedGenres = [{"id":12,"name":"Adventure"}];
                const genreIds = selectedGenres.map(genre => genre.id);
                const matchingMoviesGenre = filterByGenre(favorite_movies, genreIds);
                //Select Adventure
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                //Add title filter
                const searchString = "c";
                const matchingMovies = filterByTitle(matchingMoviesGenre, searchString);
                cy.get("#filled-search").clear().type(searchString); // Enter c in text box
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist");
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

        describe("By movie title", () => {
            it("only display movies with 'a' in the title", () => {
                const searchString = "a";
                const matchingMovies = filterByTitle(sorted_movies, searchString);
                cy.get("#filled-search").clear().type(searchString); // Enter m in text box
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                        cy.wrap($card).find("p").contains('a', {matchCase: false});
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist",);
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
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist");
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
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist");
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
                if (matchingMovies.length > 0) {
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
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist");
            });
        });
    });

    describe("The Must Watch page", () => {

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
            // Select 5 to add to must watch and navigate to Must Watch page
            cy.addToMustWatch([1,3,0,5,6]);
            cy.get("button").contains("Must Watch").click();
            sorted_movies = sortItemsLargeFirst(movies, "popularity");
            const mustwatch_ids = [0,1,5,3,6];
            mustwatch_movies = sorted_movies.filter(movie => mustwatch_ids.includes(sorted_movies.indexOf(movie)));
        });

        describe("By movie title", () => {
            it("only display movies with 'a' in the title", () => {
                const searchString = "a";
                const matchingMovies = filterByTitle(mustwatch_movies, searchString);
                cy.get("#filled-search").clear().type(searchString); // Enter m in text box
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                        cy.wrap($card).find("p").contains('a', {matchCase: false});
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist");
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
                const matchingMovies = filterByGenre(mustwatch_movies, genreIds);
                //Select Adventure
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist");
            });

            it("displays movies with multiple selected genres", () => {
                const selectedGenres = [
                    {"id":12,"name":"Adventure"},
                    {"id":35,"name":"Comedy"}
                ];
                const genreIds = selectedGenres.map(genre => genre.id);
                const matchingMovies = filterByGenre(mustwatch_movies, genreIds);
                //Select Comedy
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="3"]').click();
                //Select Adventure
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist");
            });

            it("clears one genre filter correctly", () => {
                const selectedGenres = [
                    {"id":12,"name":"Adventure"}
                ];
                const genreIds = selectedGenres.map(genre => genre.id);
                const matchingMovies = filterByGenre(mustwatch_movies, genreIds);
                //Select Comedy
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="3"]').click();
                //Select Adventure
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                //Clear the Comedy filter
                cy.get("svg").eq(3).should('have.attr', 'data-testid', 'CancelIcon').click();
                //Check cards are only filtered by adventure genre now
                if (matchingMovies.length > 0) {
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
                    cy.wrap($card).find("p").contains(mustwatch_movies[index].title);
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
                    cy.wrap($card).find("p").contains(mustwatch_movies[index].title);
                });
            });
        });

        describe("By movie title and genre", () => {
            it("only display movies with 'c' in the title within the selected genre", () => {
                //Add genre filter
                const selectedGenres = [{"id":12,"name":"Adventure"}];
                const genreIds = selectedGenres.map(genre => genre.id);
                const matchingMoviesGenre = filterByGenre(mustwatch_movies, genreIds);
                //Select Adventure
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                //Add title filter
                const searchString = "a";
                const matchingMovies = filterByTitle(matchingMoviesGenre, searchString);
                cy.get("#filled-search").clear().type(searchString); // Enter a in text box
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist");
            });
        });
    });

    describe("The Trending Movies page", () => {

        before(() => {
            cy.request(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=${Cypress.env("TMDB_KEY")}`
            )
            .its("body")
            .then((response) => {
            moviesweek = response.results;
            });

            cy.request(
            `https://api.themoviedb.org/3/trending/movie/day?api_key=${Cypress.env("TMDB_KEY")}`
            )
            .its("body")
            .then((response) => {
            moviesday = response.results;
            });
        });

        beforeEach(() => {
            cy.visit("/movies/trending/week");
            sorted_movies_week = sortItemsLargeFirst(moviesweek, "popularity");
            sorted_movies_day = sortItemsLargeFirst(moviesday, "popularity");
        });

        describe("By movie title", () => {
            it("only display movies with 'a' in the title", () => {
                const searchString = "a";
                const matchingMovies = filterByTitle(sorted_movies_week, searchString);
                cy.get("#filled-search").clear().type(searchString); // Enter m in text box
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                        cy.wrap($card).find("p").contains('a', {matchCase: false});
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist",);
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
                const matchingMovies = filterByGenre(sorted_movies_week, genreIds);
                //Select Adventure
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist");
            });

            it("displays movies with multiple selected genres", () => {
                const selectedGenres = [
                    {"id":12,"name":"Adventure"},
                    {"id":35,"name":"Comedy"}
                ];
                const genreIds = selectedGenres.map(genre => genre.id);
                const matchingMovies = filterByGenre(sorted_movies_week, genreIds);
                //Select Comedy
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="3"]').click();
                //Select Adventure
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist");
            });

            it("clears one genre filter correctly", () => {
                const selectedGenres = [
                    {"id":12,"name":"Adventure"}
                ];
                const genreIds = selectedGenres.map(genre => genre.id);
                const matchingMovies = filterByGenre(sorted_movies_week, genreIds);
                //Select Comedy
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="3"]').click();
                //Select Adventure
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                //Clear the Comedy filter
                cy.get("svg").eq(4).should('have.attr', 'data-testid', 'CancelIcon').click();
                //Check cards are only filtered by adventure genre now
                if (matchingMovies.length > 0) {
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
                    cy.wrap($card).find("p").contains(sorted_movies_week[index].title);
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
                    cy.wrap($card).find("p").contains(sorted_movies_week[index].title);
                });
            });
        });

        describe("By movie title and genre", () => {
            it("only display movies with 'c' in the title within the selected genre", () => {
                //Add genre filter
                const selectedGenres = [{"id":12,"name":"Adventure"}];
                const genreIds = selectedGenres.map(genre => genre.id);
                const matchingMoviesGenre = filterByGenre(sorted_movies_week, genreIds);
                //Select Adventure
                cy.get("#genre-select").click();
                cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                //Add title filter
                const searchString = "a";
                const matchingMovies = filterByTitle(matchingMoviesGenre, searchString);
                cy.get("#filled-search").clear().type(searchString); // Enter a in text box
                if (matchingMovies.length > 0) {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        cy.wrap($card).find("p").contains(matchingMovies[index].title);
                    });
                }
                else cy.get(".MuiCardHeader-content").should("not.exist");
            });
        });

        describe("Trending Today", () => {

            it("changes the view to the 'Trending Today' page", () => {
                cy.get("#time-select").click();
                cy.get("li").contains("Today").click();
                cy.url().should('eq', 'http://localhost:3000/movies/trending/today');
                cy.get("h3").contains("Trending Today");
            });

            describe("The Trending Today Page", () => {

                beforeEach(() => {
                    cy.visit("/movies/trending/today");
                    sorted_movies_day = sortItemsLargeFirst(moviesday, "popularity");
                });
                
                it("displays the 'Filter Movies' card and all relevant filter/sort fields", () => {
                    cy.get(".MuiGrid-root.MuiGrid-container")
                    .eq(1)
                    .find(".MuiGrid-root.MuiGrid-item")
                    .eq(0)
                    .within(() => {
                        cy.get("h1").contains("Filter Movies");
                        //Check if Input and Select fields are as expected
                        cy.get("#filled-search").should('have.class',
                            "MuiInputBase-input MuiFilledInput-input MuiInputBase-inputTypeSearch");
                        cy.get("#time-select").should('have.class', "MuiSelect-select MuiSelect-outlined MuiInputBase-input MuiOutlinedInput-input")
                        //Check if Trending is set to today
                        .contains("Today");
                        cy.get("#genre-select").should('have.class',
                            "MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused");
                        cy.get("#sort-select").should('have.class', "MuiSelect-select MuiSelect-outlined MuiInputBase-input MuiOutlinedInput-input")
                        //Check if Movies are sorted by popularity by default
                        .contains("Popularity");
                    });
                });
        
                it("displays the correct movie titles", () => {
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        //Necessary to prevent errors when API returns double spacing.
                        var title = sorted_movies_day[index].title.replace( /\s\s+/g, ' ' );
                        cy.wrap($card).find("p").contains(title);
                    });
                });
        
                describe("Movie Information", () => {
                    it("displays the correct movie posters", () => {
                        cy.get(".MuiCardMedia-root").each(($card, index) => {
                            var poster = "https://image.tmdb.org/t/p/w500/" + sorted_movies_day[index].poster_path;
                            cy.wrap($card).should('have.attr', 'style', 'background-image: url("' + poster + '");');
                        });
                    });
        
                    it("displays the correct release dates and ratings", () => {
                        cy.get(".MuiCardContent-root").each(($card, index) => {
                            var release = sorted_movies_day[index].release_date;
                            var rating = sorted_movies_day[index].vote_average;
                            cy.wrap($card).should('contain', release).and('contain', rating);
                        });
                    });
        
                    it("displays the 'Add to Favourites' and 'More Info' buttons", () => {
                        cy.get(".MuiCardActions-root").each(($card, index) => {
                            cy.wrap($card).find('button').should('have.attr', 'aria-label', 'add to favorites');
                            cy.wrap($card).find('a').should('have.attr', 'href', '/movies/' + sorted_movies_day[index].id)
                                .and('contain', 'More Info ...');
                        });
                    });
                });

                it("changes the view back to the 'Trending This Week' page", () => {
                    cy.get("#time-select").click();
                    cy.get("li").contains("This Week").click();
                    cy.url().should('eq', 'http://localhost:3000/movies/trending/week');
                    cy.get("h3").contains("Trending This Week");
                });
            });

            describe("Filtering", () => {

                beforeEach(() => {
                    cy.visit("/movies/trending/today");
                    sorted_movies_day = sortItemsLargeFirst(moviesday, "popularity");
                });

                describe("By movie title", () => {
                    it("only display movies with 'a' in the title", () => {
                        const searchString = "a";
                        const matchingMovies = filterByTitle(sorted_movies_day, searchString);
                        cy.get("#filled-search").clear().type(searchString); // Enter m in text box
                        if (matchingMovies.length > 0) {
                            cy.get(".MuiCardHeader-content").each(($card, index) => {
                                cy.wrap($card).find("p").contains(matchingMovies[index].title);
                                cy.wrap($card).find("p").contains('a', {matchCase: false});
                            });
                        }
                        else cy.get(".MuiCardHeader-content").should("not.exist",);
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
                        const matchingMovies = filterByGenre(sorted_movies_day, genreIds);
                        //Select Adventure
                        cy.get("#genre-select").click();
                        cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                        if (matchingMovies.length > 0) {
                            cy.get(".MuiCardHeader-content").each(($card, index) => {
                                cy.wrap($card).find("p").contains(matchingMovies[index].title);
                            });
                        }
                        else cy.get(".MuiCardHeader-content").should("not.exist");
                    });
        
                    it("displays movies with multiple selected genres", () => {
                        const selectedGenres = [
                            {"id":12,"name":"Adventure"},
                            {"id":35,"name":"Comedy"}
                        ];
                        const genreIds = selectedGenres.map(genre => genre.id);
                        const matchingMovies = filterByGenre(sorted_movies_day, genreIds);
                        //Select Comedy
                        cy.get("#genre-select").click();
                        cy.get('.MuiAutocomplete-popper li[data-option-index="3"]').click();
                        //Select Adventure
                        cy.get("#genre-select").click();
                        cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                        if (matchingMovies.length > 0) {
                            cy.get(".MuiCardHeader-content").each(($card, index) => {
                                cy.wrap($card).find("p").contains(matchingMovies[index].title);
                            });
                        }
                        else cy.get(".MuiCardHeader-content").should("not.exist");
                    });
        
                    it("clears one genre filter correctly", () => {
                        const selectedGenres = [
                            {"id":12,"name":"Adventure"}
                        ];
                        const genreIds = selectedGenres.map(genre => genre.id);
                        const matchingMovies = filterByGenre(sorted_movies_day, genreIds);
                        //Select Comedy
                        cy.get("#genre-select").click();
                        cy.get('.MuiAutocomplete-popper li[data-option-index="3"]').click();
                        //Select Adventure
                        cy.get("#genre-select").click();
                        cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                        //Clear the Comedy filter
                        cy.get("svg").eq(4).should('have.attr', 'data-testid', 'CancelIcon').click();
                        //Check cards are only filtered by adventure genre now
                        if (matchingMovies.length > 0) {
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
                            cy.wrap($card).find("p").contains(sorted_movies_day[index].title);
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
                            cy.wrap($card).find("p").contains(sorted_movies_day[index].title);
                        });
                    });
                });
        
                describe("By movie title and genre", () => {
                    it("only display movies with 'c' in the title within the selected genre", () => {
                        //Add genre filter
                        const selectedGenres = [{"id":12,"name":"Adventure"}];
                        const genreIds = selectedGenres.map(genre => genre.id);
                        const matchingMoviesGenre = filterByGenre(sorted_movies_day, genreIds);
                        //Select Adventure
                        cy.get("#genre-select").click();
                        cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();
                        //Add title filter
                        const searchString = "a";
                        const matchingMovies = filterByTitle(matchingMoviesGenre, searchString);
                        cy.get("#filled-search").clear().type(searchString); // Enter a in text box
                        if (matchingMovies.length > 0) {
                            cy.get(".MuiCardHeader-content").each(($card, index) => {
                                cy.wrap($card).find("p").contains(matchingMovies[index].title);
                            });
                        }
                        else cy.get(".MuiCardHeader-content").should("not.exist");
                    });
                });
            });
        });
    });

    describe("The Cast List page", () => {

        before(() => {
            cy.request(
                `https://api.themoviedb.org/3/movie/${
                    movies[0].id
                }/credits?api_key=${Cypress.env("TMDB_KEY")}`
                )
                .its("body")
                .then((castList) => {
                    cast = castList.cast;
                });
        });

        beforeEach(() => {
            cy.visit(`/movies/${movies[0].id}/cast`);
        });

        describe("By Actor", () => {
            it("only display cast members with 'm' in their name", () => {
                const searchString = "m";
                const matchingPeople = filterByName(cast, searchString);
                cy.get("#filled-search").eq(0).clear().type(searchString); // Enter m in text box
                if (matchingPeople.length > 0) {
                    cy.get(".MuiCardActions-root").each(($card, index) => {
                        cy.wrap($card).find("a").contains(matchingPeople[index].name);
                        cy.wrap($card).find("a").contains('m', {matchCase: false});
                    });
                }
                else cy.get(".MuiCardActions-root").should("not.exist");
            });

            it("displays nothing when no people match", () => {
                const searchString = "xxxzy";
                cy.get("#filled-search").clear().type(searchString); // Enter m in text box
                cy.get(".MuiCardActions-root").should("have.length", 0);
            });
        });

        describe("By Character", () => {
            it("only display cast members who play a character with 'm' in their name", () => {
                const searchString = "m";
                const matchingPeople = filterByCharacter(cast, searchString);
                cy.get(".MuiFormControl-root").eq(1).find(".MuiInputBase-root").find("input").clear().type(searchString); // Enter m in text box
                if (matchingPeople.length > 0) {
                    cy.get(".MuiCardActions-root").each(($card, index) => {
                        cy.wrap($card).get(".MuiCardContent-root").find("p").contains(matchingPeople[index].character);
                        cy.wrap($card).get(".MuiCardContent-root").find("p").contains('m', {matchCase: false});
                    });
                }
                else cy.get(".MuiCardActions-root").should("not.exist");
            });

            it("displays nothing when no people match", () => {
                const searchString = "xxxzy";
                cy.get(".MuiFormControl-root").eq(1).find(".MuiInputBase-root").find("input").clear().type(searchString); // Enter m in text box
                cy.get(".MuiCardActions-root").should("have.length", 0);
            });
        });

        describe("By Actor and Character", () => {
            it("only display cast members with 'c' in their name and 'a' in their character name", () => {
                const searchNameString = "c";
                const matchingNamePeople = filterByName(cast, searchNameString);
                const searchCharString = "a";
                const matchingPeople = filterByCharacter(matchingNamePeople, searchCharString);
                cy.get("#filled-search").eq(0).clear().type(searchNameString); // Enter c in text box
                cy.get(".MuiFormControl-root").eq(1).find(".MuiInputBase-root").find("input").clear().type(searchCharString); // Enter a in text box
                if (matchingPeople.length > 0) {
                    cy.get(".MuiCardActions-root").each(($card, index) => {
                        cy.wrap($card).find("a").contains(matchingPeople[index].name);
                        cy.wrap($card).find("a").contains('c', {matchCase: false});

                        cy.wrap($card).get(".MuiCardContent-root").find("p").contains(matchingPeople[index].character);
                        cy.wrap($card).get(".MuiCardContent-root").find("p").contains('a', {matchCase: false});
                    });
                }
                else cy.get(".MuiCardActions-root").should("not.exist");
            });
        });
    });

    describe("The Crew List page", () => {

        before(() => {
            cy.request(
                `https://api.themoviedb.org/3/movie/${
                    movies[0].id
                }/credits?api_key=${Cypress.env("TMDB_KEY")}`
                )
                .its("body")
                .then((crewList) => {
                    //Filter Crew List so crew members with multiple jobs are displayed in one person card rather than multiple jobs
                    crew = crewList.crew.filter(function(entry) {
                        var previous;
        
                        if (seen.hasOwnProperty(entry.id)) {
                            previous = seen[entry.id];
                            previous.job = previous.job + ', ' + entry.job;
                            return false;
                        }
        
                        seen[entry.id] = entry;
                        return true;
                    });;
                });
        });

        beforeEach(() => {
            cy.visit(`/movies/${movies[0].id}/crew`);
        });

        describe("By Name", () => {
            it("only display crew members with 'm' in their name", () => {
                const searchString = "m";
                const matchingPeople = filterByName(crew, searchString);
                cy.get("#filled-search").eq(0).clear().type(searchString); // Enter m in text box
                if (matchingPeople.length > 0) {
                    cy.get(".MuiCardActions-root").each(($card, index) => {
                        cy.wrap($card).find("a").contains(matchingPeople[index].name);
                        cy.wrap($card).find("a").contains('m', {matchCase: false});
                    });
                }
                else cy.get(".MuiCardActions-root").should("not.exist");
            });

            it("displays nothing when no people match", () => {
                const searchString = "xxxzy";
                cy.get("#filled-search").clear().type(searchString); // Enter m in text box
                cy.get(".MuiCardActions-root").should("have.length", 0);
            });
        });

        describe("By Job", () => {
            it("only display crew members who have 'director' in their job descriptions", () => {
                const searchString = "director";
                const matchingPeople = filterByJob(crew, searchString);
                cy.get(".MuiFormControl-root").eq(1).find(".MuiInputBase-root").find("input").clear().type(searchString); // Enter director in text box
                if (matchingPeople.length > 0) {
                    cy.get(".MuiCardActions-root").each(($card, index) => {
                        cy.wrap($card).get(".MuiCardContent-root").find("p").contains(matchingPeople[index].job);
                        cy.wrap($card).get(".MuiCardContent-root").find("p").contains('director', {matchCase: false});
                    });
                }
                else cy.get(".MuiCardActions-root").should("not.exist");
            });

            it("displays nothing when no people match", () => {
                const searchString = "xxxzy";
                cy.get(".MuiFormControl-root").eq(1).find(".MuiInputBase-root").find("input").clear().type(searchString); // Enter m in text box
                cy.get(".MuiCardActions-root").should("have.length", 0);
            });
        });

        describe("By Name and Job", () => {
            it("only display crew members with 'c' in their name and 'so' in their job description", () => {
                const searchNameString = "c";
                const matchingNamePeople = filterByName(crew, searchNameString);
                const searchJobString = "so";
                const matchingPeople = filterByJob(matchingNamePeople, searchJobString);
                cy.get("#filled-search").eq(0).clear().type(searchNameString); // Enter c in text box
                cy.get(".MuiFormControl-root").eq(1).find(".MuiInputBase-root").find("input").clear().type(searchJobString); // Enter a in text box
                if (matchingPeople.length > 0) {
                    cy.get(".MuiCardActions-root").each(($card, index) => {
                        cy.wrap($card).find("a").contains(matchingPeople[index].name);
                        cy.wrap($card).find("a").contains('c', {matchCase: false});

                        cy.wrap($card).get(".MuiCardContent-root").find("p").contains(matchingPeople[index].job);
                        cy.wrap($card).get(".MuiCardContent-root").find("p").contains('so', {matchCase: false});
                    });
                }
                else cy.get(".MuiCardActions-root").should("not.exist");
            });
        });
    });
});