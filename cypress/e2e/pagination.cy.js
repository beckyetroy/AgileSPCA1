import { sortItemsLargeFirst } from "../support/e2e";

let movies; // List of Discover movies from TMDB

let favorite_movies; // List of movies that have been added to favourites
let mustwatch_movies; // List of movies that have been added to must watch

let moviesweek; // List of movies trending this week
let moviesday; // List of movies trending today

let cast; // List of cast members for a particular movie
let crew; //List of crew members for a particular movie
var seen = {}; //Used for filtering crew and favorites list 

describe("Pagination", () => {
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
            movies = sortItemsLargeFirst(movies, "popularity");
        });

        describe("Using the Number Buttons", () => {

            it("shows the second page of 7 movies when '2' is pressed", () => {
                cy.get(".pagination").within(() => {
                    cy.get("li").eq(2).click();
                });

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index + 7].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows the third page of 7 movies when '3' is pressed", () => {
                cy.get(".pagination").within(() => {
                    cy.get("li").eq(3).click();
                });

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index + 14].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows the first page of 7 movies when '1' is pressed", () => {
                //Go to page 3 first
                cy.get(".pagination").within(() => {
                    cy.get("li").eq(3).click();
                });

                cy.get(".pagination").within(() => {
                    cy.get("li").eq(1).click();
                });

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows no change when current page is pressed", () => {
                cy.get(".pagination").within(() => {
                    cy.get("li").eq(2).click();
                });

                cy.get(".pagination").within(() => {
                    cy.get("li").eq(2).click();
                });

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index + 7].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });
        });

        describe("Using Next and Previous Buttons", () => {
            it("shows the second page of 7 movies when 'next button' is pressed", () => {
                cy.get("li.next").click();

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index + 7].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows the third page of 7 movies when 'next button' is pressed twice", () => {
                cy.get("li.next").click();
                cy.get("li.next").click();

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index + 14].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows the second page of 7 movies when 'previous button' is pressed from page 3", () => {
                cy.get("li.next").click();
                cy.get("li.next").click();
                cy.get("li.previous").click();

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index + 7].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows the first page of 7 movies when 'previous button' is pressed twice from page 3", () => {
                cy.get("li.next").click();
                cy.get("li.next").click();
                cy.get("li.previous").click();
                cy.get("li.previous").click();

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows no change when previous button is pressed on page 1", () => {
                cy.get("li.previous").click();

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows no change when next button is pressed on page 3", () => {
                cy.get("li.next").click();
                cy.get("li.next").click();
                cy.get("li.next").click();

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index + 14].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
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
            movies = sortItemsLargeFirst(movies, "popularity");
        });

        describe("Using the Number Buttons", () => {

            it("shows the second page of 7 movies when '2' is pressed", () => {
                cy.get(".pagination").within(() => {
                    cy.get("li").eq(2).click();
                });

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index + 7].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows the third page of 7 movies when '3' is pressed", () => {
                cy.get(".pagination").within(() => {
                    cy.get("li").eq(3).click();
                });

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index + 14].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows the first page of 7 movies when '1' is pressed", () => {
                //Go to page 3 first
                cy.get(".pagination").within(() => {
                    cy.get("li").eq(3).click();
                });

                cy.get(".pagination").within(() => {
                    cy.get("li").eq(1).click();
                });

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows no change when current page is pressed", () => {
                cy.get(".pagination").within(() => {
                    cy.get("li").eq(2).click();
                });

                cy.get(".pagination").within(() => {
                    cy.get("li").eq(2).click();
                });

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index + 7].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });
        });

        describe("Using Next and Previous Buttons", () => {
            it("shows the second page of 7 movies when 'next button' is pressed", () => {
                cy.get("li.next").click();

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index + 7].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows the third page of 7 movies when 'next button' is pressed twice", () => {
                cy.get("li.next").click();
                cy.get("li.next").click();

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index + 14].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows the second page of 7 movies when 'previous button' is pressed from page 3", () => {
                cy.get("li.next").click();
                cy.get("li.next").click();
                cy.get("li.previous").click();

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index + 7].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows the first page of 7 movies when 'previous button' is pressed twice from page 3", () => {
                cy.get("li.next").click();
                cy.get("li.next").click();
                cy.get("li.previous").click();
                cy.get("li.previous").click();

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows no change when previous button is pressed on page 1", () => {
                cy.get("li.previous").click();

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows no change when next button is pressed on page 3", () => {
                cy.get("li.next").click();
                cy.get("li.next").click();
                cy.get("li.next").click();

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = movies[index + 14].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
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
            moviesweek = sortItemsLargeFirst(moviesweek, "popularity");
            moviesday = sortItemsLargeFirst(moviesday, "popularity");
        });

        describe("Using the Number Buttons", () => {

            it("shows the second page of 7 movies when '2' is pressed", () => {
                cy.get(".pagination").within(() => {
                    cy.get("li").eq(2).click();
                });

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = moviesweek[index + 7].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows the third page of 7 movies when '3' is pressed", () => {
                cy.get(".pagination").within(() => {
                    cy.get("li").eq(3).click();
                });

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = moviesweek[index + 14].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows the first page of 7 movies when '1' is pressed", () => {
                //Go to page 3 first
                cy.get(".pagination").within(() => {
                    cy.get("li").eq(3).click();
                });

                cy.get(".pagination").within(() => {
                    cy.get("li").eq(1).click();
                });

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = moviesweek[index].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows no change when current page is pressed", () => {
                cy.get(".pagination").within(() => {
                    cy.get("li").eq(2).click();
                });

                cy.get(".pagination").within(() => {
                    cy.get("li").eq(2).click();
                });

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = moviesweek[index + 7].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });
        });

        describe("Using Next and Previous Buttons", () => {
            it("shows the second page of 7 movies when 'next button' is pressed", () => {
                cy.get("li.next").click();

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = moviesweek[index + 7].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows the third page of 7 movies when 'next button' is pressed twice", () => {
                cy.get("li.next").click();
                cy.get("li.next").click();

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = moviesweek[index + 14].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows the second page of 7 movies when 'previous button' is pressed from page 3", () => {
                cy.get("li.next").click();
                cy.get("li.next").click();
                cy.get("li.previous").click();

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = moviesweek[index + 7].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows the first page of 7 movies when 'previous button' is pressed twice from page 3", () => {
                cy.get("li.next").click();
                cy.get("li.next").click();
                cy.get("li.previous").click();
                cy.get("li.previous").click();

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = moviesweek[index].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows no change when previous button is pressed on page 1", () => {
                cy.get("li.previous").click();

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = moviesweek[index].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });

            it("shows no change when next button is pressed on page 3", () => {
                cy.get("li.next").click();
                cy.get("li.next").click();
                cy.get("li.next").click();

                cy.get(".MuiCardHeader-content").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var title = moviesweek[index + 14].title.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("p").contains(title);
                });
            });
        });

        describe("Trending Today", () => {
            beforeEach(() => {
                cy.visit("/movies/trending/today");
            });

            describe("Using the Number Buttons", () => {

                it("shows the second page of 7 movies when '2' is pressed", () => {
                    cy.get(".pagination").within(() => {
                        cy.get("li").eq(2).click();
                    });
    
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        //Necessary to prevent errors when API returns double spacing.
                        var title = moviesday[index + 7].title.replace( /\s\s+/g, ' ' );
                        cy.wrap($card).find("p").contains(title);
                    });
                });
    
                it("shows the third page of 7 movies when '3' is pressed", () => {
                    cy.get(".pagination").within(() => {
                        cy.get("li").eq(3).click();
                    });
    
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        //Necessary to prevent errors when API returns double spacing.
                        var title = moviesday[index + 14].title.replace( /\s\s+/g, ' ' );
                        cy.wrap($card).find("p").contains(title);
                    });
                });
    
                it("shows the first page of 7 movies when '1' is pressed", () => {
                    //Go to page 3 first
                    cy.get(".pagination").within(() => {
                        cy.get("li").eq(3).click();
                    });
    
                    cy.get(".pagination").within(() => {
                        cy.get("li").eq(1).click();
                    });
    
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        //Necessary to prevent errors when API returns double spacing.
                        var title = moviesday[index].title.replace( /\s\s+/g, ' ' );
                        cy.wrap($card).find("p").contains(title);
                    });
                });
    
                it("shows no change when current page is pressed", () => {
                    cy.get(".pagination").within(() => {
                        cy.get("li").eq(2).click();
                    });
    
                    cy.get(".pagination").within(() => {
                        cy.get("li").eq(2).click();
                    });
    
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        //Necessary to prevent errors when API returns double spacing.
                        var title = moviesday[index + 7].title.replace( /\s\s+/g, ' ' );
                        cy.wrap($card).find("p").contains(title);
                    });
                });
            });
    
            describe("Using Next and Previous Buttons", () => {
                it("shows the second page of 7 movies when 'next button' is pressed", () => {
                    cy.get("li.next").click();
    
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        //Necessary to prevent errors when API returns double spacing.
                        var title = moviesday[index + 7].title.replace( /\s\s+/g, ' ' );
                        cy.wrap($card).find("p").contains(title);
                    });
                });
    
                it("shows the third page of 7 movies when 'next button' is pressed twice", () => {
                    cy.get("li.next").click();
                    cy.get("li.next").click();
    
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        //Necessary to prevent errors when API returns double spacing.
                        var title = moviesday[index + 14].title.replace( /\s\s+/g, ' ' );
                        cy.wrap($card).find("p").contains(title);
                    });
                });
    
                it("shows the second page of 7 movies when 'previous button' is pressed from page 3", () => {
                    cy.get("li.next").click();
                    cy.get("li.next").click();
                    cy.get("li.previous").click();
    
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        //Necessary to prevent errors when API returns double spacing.
                        var title = moviesday[index + 7].title.replace( /\s\s+/g, ' ' );
                        cy.wrap($card).find("p").contains(title);
                    });
                });
    
                it("shows the first page of 7 movies when 'previous button' is pressed twice from page 3", () => {
                    cy.get("li.next").click();
                    cy.get("li.next").click();
                    cy.get("li.previous").click();
                    cy.get("li.previous").click();
    
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        //Necessary to prevent errors when API returns double spacing.
                        var title = moviesday[index].title.replace( /\s\s+/g, ' ' );
                        cy.wrap($card).find("p").contains(title);
                    });
                });
    
                it("shows no change when previous button is pressed on page 1", () => {
                    cy.get("li.previous").click();
    
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        //Necessary to prevent errors when API returns double spacing.
                        var title = moviesday[index].title.replace( /\s\s+/g, ' ' );
                        cy.wrap($card).find("p").contains(title);
                    });
                });
    
                it("shows no change when next button is pressed on page 3", () => {
                    cy.get("li.next").click();
                    cy.get("li.next").click();
                    cy.get("li.next").click();
    
                    cy.get(".MuiCardHeader-content").each(($card, index) => {
                        //Necessary to prevent errors when API returns double spacing.
                        var title = moviesday[index + 14].title.replace( /\s\s+/g, ' ' );
                        cy.wrap($card).find("p").contains(title);
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

        describe("Using the Number Buttons", () => {

            it("shows the second page of 11 cast members when '2' is pressed", () => {
                cy.get(".pagination").within(() => {
                    cy.get("li").eq(2).click();
                });

                cy.get(".MuiCardActions-root").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var name = cast[index + 11].name.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("a").contains(name);
                });
            });

            it("shows the first page of 11 cast members when '1' is pressed", () => {
                //Go to page 2 first
                cy.get(".pagination").within(() => {
                    cy.get("li").eq(2).click();
                });

                cy.get(".pagination").within(() => {
                    cy.get("li").eq(1).click();
                });

                cy.get(".MuiCardActions-root").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var name = cast[index].name.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("a").contains(name);
                });
            });

            it("shows no change when current page is pressed", () => {
                cy.get(".pagination").within(() => {
                    cy.get("li").eq(2).click();
                });

                cy.get(".pagination").within(() => {
                    cy.get("li").eq(2).click();
                });

                cy.get(".MuiCardActions-root").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var name = cast[index + 11].name.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("a").contains(name);
                });
            });
        });

        describe("Using Next and Previous Buttons", () => {
            it("shows the second page of 11 cast members when 'next button' is pressed", () => {
                cy.get("li.next").click();

                cy.get(".MuiCardActions-root").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var name = cast[index + 11].name.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("a").contains(name);
                });
            });

            it("shows the first page of 11 cast members when 'previous button' is pressed", () => {
                cy.get("li.next").click();
                cy.get("li.previous").click();

                cy.get(".MuiCardActions-root").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var name = cast[index].name.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("a").contains(name);
                });
            });

            it("shows no change when previous button is pressed on page 1", () => {
                cy.get("li.previous").click();

                cy.get(".MuiCardActions-root").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var name = cast[index].name.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("a").contains(name);
                });
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

        describe("Using the Number Buttons", () => {

            it("shows the second page of 11 crew members when '2' is pressed", () => {
                cy.get(".pagination").within(() => {
                    cy.get("li").eq(2).click();
                });

                cy.get(".MuiCardActions-root").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var name = crew[index + 11].name.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("a").contains(name);
                });
            });

            it("shows the first page of 11 crew members when '1' is pressed", () => {
                //Go to page 2 first
                cy.get(".pagination").within(() => {
                    cy.get("li").eq(2).click();
                });

                cy.get(".pagination").within(() => {
                    cy.get("li").eq(1).click();
                });

                cy.get(".MuiCardActions-root").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var name = crew[index].name.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("a").contains(name);
                });
            });

            it("shows no change when current page is pressed", () => {
                cy.get(".pagination").within(() => {
                    cy.get("li").eq(2).click();
                });

                cy.get(".pagination").within(() => {
                    cy.get("li").eq(2).click();
                });

                cy.get(".MuiCardActions-root").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var name = crew[index + 11].name.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("a").contains(name);
                });
            });
        });

        describe("Using Next and Previous Buttons", () => {
            it("shows the second page of 11 crew members when 'next button' is pressed", () => {
                cy.get("li.next").click();

                cy.get(".MuiCardActions-root").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var name = crew[index + 11].name.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("a").contains(name);
                });
            });

            it("shows the first page of 11 crew members when 'previous button' is pressed", () => {
                cy.get("li.next").click();
                cy.get("li.previous").click();

                cy.get(".MuiCardActions-root").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var name = crew[index].name.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("a").contains(name);
                });
            });

            it("shows no change when previous button is pressed on page 1", () => {
                cy.get("li.previous").click();

                cy.get(".MuiCardActions-root").each(($card, index) => {
                    //Necessary to prevent errors when API returns double spacing.
                    var name = crew[index].name.replace( /\s\s+/g, ' ' );
                    cy.wrap($card).find("a").contains(name);
                });
            });
        });
    });
});