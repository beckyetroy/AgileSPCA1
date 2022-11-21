import { sortItemsLargeFirst, sortItemsSmallFirst } from "../support/e2e";

let movies; // List of Discover movies from TMDB

let favorite_movies; // List of movies that have been added to favourites
let mustwatch_movies; // List of movies that have been added to must watch

let moviesweek; // List of movies trending this week
let moviesday; // List of movies trending today

var seen = {}; //Used for filtering crew and favorites list 

describe("Sorting Movies", () => {
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
        });

        it("Sorts alphabetically by title", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            movies = sortItemsSmallFirst(movies, "title");

            cy.verifyMovieTitles(movies);
        });

        it("Sorts by popularity", () => {
            //As movies are already sorted by popularity by default and this is checked in
            //base tests, we will check if it still sorts by popularity after the filter has been changed
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            cy.get("#sort-select").click();
            cy.get("li").contains("Popularity").click();
            movies = sortItemsLargeFirst(movies, "popularity");

            cy.verifyMovieTitles(movies);
        });

        it("Sorts by rating", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Rating").click();
            movies = sortItemsLargeFirst(movies, "vote_average");

            cy.verifyMovieTitles(movies);
        });

        it("Sorts by release date, with newest released first", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Release Date").click();
            movies = sortItemsLargeFirst(movies, "release_date");

            cy.verifyMovieTitles(movies);
        });
    });

    describe("The Favorites page", () => {

        beforeEach(() => {
            cy.visit("/");
            // Select 5 favourites and navigate to the favourites page
            cy.addToFavourites([0,1,5,3,6]);
            cy.get("button").contains("Favorites").click();
            //As movies are selected through discover movies page, their indexes are according to
            //their position after sorted by popularity
            movies = sortItemsLargeFirst(movies, "popularity");
            const favorite_ids = [0,1,5,3,6];
            favorite_movies = movies.filter(movie => favorite_ids.includes(movies.indexOf(movie)));
        });

        it("Sorts alphabetically by title", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            favorite_movies = sortItemsSmallFirst(favorite_movies, "title");

            cy.verifyMovieTitles(favorite_movies);
        });

        it("Sorts by popularity", () => {
            //As movies are already sorted by popularity by default and this is checked in
            //base tests, we will check if it still sorts by popularity after the filter has been changed
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            cy.get("#sort-select").click();
            cy.get("li").contains("Popularity").click();
            favorite_movies = sortItemsLargeFirst(favorite_movies, "popularity");

            cy.verifyMovieTitles(favorite_movies);
        });

        it("Sorts by rating", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Rating").click();
            favorite_movies = sortItemsLargeFirst(favorite_movies, "vote_average");
            //If ratings are the same, more accurate ratings are needed
            favorite_movies = favorite_movies.filter(function(movie) {
                var previous;

                if (seen.hasOwnProperty(movie.vote_average)) {
                    previous = seen[movie.vote_average];
                    cy.request(
                        `https://api.themoviedb.org/3/movie/${
                            movie.id
                        }?api_key=${Cypress.env("TMDB_KEY")}`
                        )
                        .its("body")
                        .then((movieDetails) => {
                            movie.vote_average = movieDetails.vote_average;
                        });
                    cy.request(
                        `https://api.themoviedb.org/3/movie/${
                            previous.id
                        }?api_key=${Cypress.env("TMDB_KEY")}`
                        )
                        .its("body")
                        .then((movieDetails) => {
                            previous.vote_average = movieDetails.vote_average;
                        });
                    return true;
                }

                seen[movie.vote_average] = movie;
                return true;
            });

            //Sort them again with any new ratings
            favorite_movies = favorite_movies.sort((i1, i2) => {
                return i1.vote_average - i2.vote_average;
            }).reverse();

            cy.verifyMovieTitles(favorite_movies);
        });

        it("Sorts by release date, with newest released first", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Release Date").click();
            favorite_movies = sortItemsLargeFirst(favorite_movies, "release_date");

            cy.verifyMovieTitles(favorite_movies);
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
        });
    
        it("Sorts alphabetically by title", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            movies = sortItemsSmallFirst(movies, "title");

            cy.verifyMovieTitles(movies);
        });

        it("Sorts by popularity", () => {
            //As movies are already sorted by popularity by default and this is checked in
            //base tests, we will check if it still sorts by popularity after the filter has been changed
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            cy.get("#sort-select").click();
            cy.get("li").contains("Popularity").click();
            movies = sortItemsLargeFirst(movies, "popularity");

            cy.verifyMovieTitles(movies);
        });

        it("Sorts by rating", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Rating").click();
            movies = sortItemsLargeFirst(movies, "vote_average");

            cy.verifyMovieTitles(movies);
        });

        it("Sorts by release date, with newest released first", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Release Date").click();
            movies = sortItemsLargeFirst(movies, "release_date");

            cy.verifyMovieTitles(movies);
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
            movies = sortItemsLargeFirst(movies, "popularity");
            const mustwatch_ids = [0,1,5,3,6];
            mustwatch_movies = movies.filter(movie => mustwatch_ids.includes(movies.indexOf(movie)));
        });

        it("Sorts alphabetically by title", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            mustwatch_movies = sortItemsSmallFirst(mustwatch_movies, "title");

            cy.verifyMovieTitles(mustwatch_movies);
        });

        it("Sorts by popularity", () => {
            //As movies are already sorted by popularity by default and this is checked in
            //base tests, we will check if it still sorts by popularity after the filter has been changed
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            cy.get("#sort-select").click();
            cy.get("li").contains("Popularity").click();
            mustwatch_movies = sortItemsLargeFirst(mustwatch_movies, "popularity");

            cy.verifyMovieTitles(mustwatch_movies);
        });

        it("Sorts by rating", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Rating").click();
            mustwatch_movies = sortItemsLargeFirst(mustwatch_movies, "vote_average");
            //If ratings are the same, more accurate ratings are needed
            mustwatch_movies = mustwatch_movies.filter(function(movie) {
                var previous;

                if (seen.hasOwnProperty(movie.vote_average)) {
                    previous = seen[movie.vote_average];
                    cy.request(
                        `https://api.themoviedb.org/3/movie/${
                            movie.id
                        }?api_key=${Cypress.env("TMDB_KEY")}`
                        )
                        .its("body")
                        .then((movieDetails) => {
                            movie.vote_average = movieDetails.vote_average;
                        });
                    cy.request(
                        `https://api.themoviedb.org/3/movie/${
                            previous.id
                        }?api_key=${Cypress.env("TMDB_KEY")}`
                        )
                        .its("body")
                        .then((movieDetails) => {
                            previous.vote_average = movieDetails.vote_average;
                        });
                    return true;
                }

                seen[movie.vote_average] = movie;
                return true;
            });

            //Sort them again with any new ratings
            mustwatch_movies = mustwatch_movies.sort((i1, i2) => {
                return i1.vote_average - i2.vote_average;
            }).reverse();

            cy.verifyMovieTitles(mustwatch_movies);
        });

        it("Sorts by release date, with newest released first", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Release Date").click();
            mustwatch_movies = sortItemsLargeFirst(mustwatch_movies, "release_date");

            cy.verifyMovieTitles(mustwatch_movies);
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
        });

        it("Sorts alphabetically by title", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            const moviesweek1 = sortItemsSmallFirst(moviesweek, "title");

            cy.verifyMovieTitles(moviesweek1);
        });

        it("Sorts by popularity", () => {
            //As movies are already sorted by popularity by default and this is checked in
            //base tests, we will check if it still sorts by popularity after the filter has been changed
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            cy.get("#sort-select").click();
            cy.get("li").contains("Popularity").click();
            const moviesweek2 = sortItemsLargeFirst(moviesweek, "popularity");

            cy.verifyMovieTitles(moviesweek2);
        });

        it("Sorts by rating", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Rating").click();
            const moviesweek3 = sortItemsLargeFirst(moviesweek, "vote_average");

            cy.verifyMovieTitles(moviesweek3);
        });

        describe("Trending Today", () => {
            beforeEach(() => {
                cy.visit("/movies/trending/today");
            });
            
            it("Sorts alphabetically by title", () => {
                cy.get("#sort-select").click();
                cy.get("li").contains("Alphabetical").click();
                const moviesday1 = sortItemsSmallFirst(moviesday, "title");
    
                cy.verifyMovieTitles(moviesday1);
            });
    
            it("Sorts by popularity", () => {
                //As movies are already sorted by popularity by default and this is checked in
                //base tests, we will check if it still sorts by popularity after the filter has been changed
                cy.get("#sort-select").click();
                cy.get("li").contains("Alphabetical").click();
                cy.get("#sort-select").click();
                cy.get("li").contains("Popularity").click();
                const moviesday2 = sortItemsLargeFirst(moviesday, "popularity");
    
                cy.verifyMovieTitles(moviesday2);
            });
    
            it("Sorts by rating", () => {
                cy.get("#sort-select").click();
                cy.get("li").contains("Rating").click();
                const moviesday3 = sortItemsLargeFirst(moviesday, "vote_average");
    
                cy.verifyMovieTitles(moviesday3);
            });
        });
    });
});