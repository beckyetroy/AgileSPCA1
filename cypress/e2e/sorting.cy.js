import { sortItemsLargeFirst, sortItemsSmallFirst } from "../support/e2e";

let movies; // List of Discover movies from TMDB

let favorite_movies; // List of movies that have been added to favourites
let mustwatch_movies; // List of movies that have been added to must watch

let moviesweek; // List of movies trending this week
let moviesday; // List of movies trending today

let cast; // List of cast members for a particular movie
let crew; //List of crew members for a particular movie
var seen = {}; //Used for filtering crew and favorites list 

describe("Sorting", () => {
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

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = movies[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
            });
        });

        it("Sorts by popularity", () => {
            //As movies are already sorted by popularity by default and this is checked in
            //base tests, we will check if it still sorts by popularity after the filter has been changed
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            cy.get("#sort-select").click();
            cy.get("li").contains("Popularity").click();
            movies = sortItemsLargeFirst(movies, "popularity");

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = movies[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
            });
        });

        it("Sorts by rating", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Rating").click();
            movies = sortItemsLargeFirst(movies, "vote_average");

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = movies[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
            });
        });

        it("Sorts by release date, with newest released first", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Release Date").click();
            movies = sortItemsLargeFirst(movies, "release_date");

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = movies[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
            });
        });
    });

    describe("The Favorites page", () => {

        beforeEach(() => {
            cy.visit("/");
            // Select 5 favourites and navigate to the favourites page
            cy.get("button[aria-label='add to favorites']").eq(0).click();
            cy.get("button[aria-label='add to favorites']").eq(1).click();
            cy.get("button[aria-label='add to favorites']").eq(5).click();
            cy.get("button[aria-label='add to favorites']").eq(3).click();
            cy.get("button[aria-label='add to favorites']").eq(6).click();
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

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = favorite_movies[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
            });
        });

        it("Sorts by popularity", () => {
            //As movies are already sorted by popularity by default and this is checked in
            //base tests, we will check if it still sorts by popularity after the filter has been changed
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            cy.get("#sort-select").click();
            cy.get("li").contains("Popularity").click();
            favorite_movies = sortItemsLargeFirst(favorite_movies, "popularity");

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = favorite_movies[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
            });
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

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = favorite_movies[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
            });
        });

        it("Sorts by release date, with newest released first", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Release Date").click();
            favorite_movies = sortItemsLargeFirst(favorite_movies, "release_date");

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = favorite_movies[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
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
        });
    
        it("Sorts alphabetically by title", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            movies = sortItemsSmallFirst(movies, "title");

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = movies[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
            });
        });

        it("Sorts by popularity", () => {
            //As movies are already sorted by popularity by default and this is checked in
            //base tests, we will check if it still sorts by popularity after the filter has been changed
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            cy.get("#sort-select").click();
            cy.get("li").contains("Popularity").click();
            movies = sortItemsLargeFirst(movies, "popularity");

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = movies[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
            });
        });

        it("Sorts by rating", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Rating").click();
            movies = sortItemsLargeFirst(movies, "vote_average");

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = movies[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
            });
        });

        it("Sorts by release date, with newest released first", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Release Date").click();
            movies = sortItemsLargeFirst(movies, "release_date");

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = movies[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
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
            cy.get("button[aria-label='add to must watch']").eq(1).click();
            cy.get("button[aria-label='add to must watch']").eq(3).click();
            cy.get("button[aria-label='add to must watch']").eq(0).click();
            cy.get("button[aria-label='add to must watch']").eq(5).click();
            cy.get("button[aria-label='add to must watch']").eq(6).click();
            cy.get("button").contains("Must Watch").click();
            movies = sortItemsLargeFirst(movies, "popularity");
            const mustwatch_ids = [0,1,5,3,6];
            mustwatch_movies = movies.filter(movie => mustwatch_ids.includes(movies.indexOf(movie)));
        });

        it("Sorts alphabetically by title", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            mustwatch_movies = sortItemsSmallFirst(mustwatch_movies, "title");

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = mustwatch_movies[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
            });
        });

        it("Sorts by popularity", () => {
            //As movies are already sorted by popularity by default and this is checked in
            //base tests, we will check if it still sorts by popularity after the filter has been changed
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            cy.get("#sort-select").click();
            cy.get("li").contains("Popularity").click();
            mustwatch_movies = sortItemsLargeFirst(mustwatch_movies, "popularity");

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = mustwatch_movies[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
            });
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

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = mustwatch_movies[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
            });
        });

        it("Sorts by release date, with newest released first", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Release Date").click();
            mustwatch_movies = sortItemsLargeFirst(mustwatch_movies, "release_date");

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = mustwatch_movies[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
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
        });

        it("Sorts alphabetically by title", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            const moviesweek1 = sortItemsSmallFirst(moviesweek, "title");

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = moviesweek1[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
            });
        });

        it("Sorts by popularity", () => {
            //As movies are already sorted by popularity by default and this is checked in
            //base tests, we will check if it still sorts by popularity after the filter has been changed
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            cy.get("#sort-select").click();
            cy.get("li").contains("Popularity").click();
            const moviesweek2 = sortItemsLargeFirst(moviesweek, "popularity");

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = moviesweek2[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
            });
        });

        it("Sorts by rating", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Rating").click();
            const moviesweek3 = sortItemsLargeFirst(moviesweek, "vote_average");

            cy.get(".MuiCardHeader-content").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var title = moviesweek3[index].title.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("p").contains(title);
            });
        });

        describe("Trending Today", () => {
            beforeEach(() => {
                cy.visit("/movies/trending/today");
            });
            
            it("Sorts alphabetically by title", () => {
                cy.get("#sort-select").click();
                cy.get("li").contains("Alphabetical").click();
                const moviesday1 = sortItemsSmallFirst(moviesday, "title");
    
                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = moviesday1[index].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });
    
            it("Sorts by popularity", () => {
                //As movies are already sorted by popularity by default and this is checked in
                //base tests, we will check if it still sorts by popularity after the filter has been changed
                cy.get("#sort-select").click();
                cy.get("li").contains("Alphabetical").click();
                cy.get("#sort-select").click();
                cy.get("li").contains("Popularity").click();
                const moviesday2 = sortItemsLargeFirst(moviesday, "popularity");
    
                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = moviesday2[index].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });
    
            it("Sorts by rating", () => {
                cy.get("#sort-select").click();
                cy.get("li").contains("Rating").click();
                const moviesday3 = sortItemsLargeFirst(moviesday, "vote_average");
    
                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = moviesday3[index].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
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

        it("Sorts alphabetically by name", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            cast = sortItemsSmallFirst(cast, "name");

            cy.get(".MuiCardActions-root").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var name = cast[index].name.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("a").contains(name);
            });
        });

        it("Sorts by popularity", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Popularity").click();
            cast = sortItemsLargeFirst(cast, "popularity");

            cy.get(".MuiCardActions-root").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var name = cast[index].name.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("a").contains(name);
            });
        });

        it("Sorts by relevance", () => {
            //As cast members are already sorted by relevance by default, we will check
            //if it still sorts by relevance after the filter has been changed
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            cy.get("#sort-select").click();
            cy.get("li").contains("Relevance").click();
            cast = sortItemsSmallFirst(cast, "order");

            cy.get(".MuiCardActions-root").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var name = cast[index].name.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("a").contains(name);
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

        it("Sorts alphabetically by name", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Alphabetical").click();
            const crew1 = sortItemsSmallFirst(crew, "name");

            cy.get(".MuiCardActions-root").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var name = crew1[index].name.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("a").contains(name);
            });
        });

        it("Sorts by popularity", () => {
            cy.get("#sort-select").click();
            cy.get("li").contains("Popularity").click();
            const crew2 = sortItemsLargeFirst(crew, "popularity");

            cy.get(".MuiCardActions-root").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var name = crew2[index].name.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("a").contains(name);
            });
        });
    });
});