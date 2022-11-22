import { sortItemsLargeFirst, sortItemsSmallFirst } from "../support/e2e";

let cast; // List of cast members for a particular movie
let crew; //List of crew members for a particular movie
let movies; // List of Discover movies from TMDB
var seen = {}; //Used for filtering crew and favorites list

describe("Sorting People", () => {
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
            cy.get("[id='sort-select']").click();
            cy.get("li").contains("Alphabetical").click();
            cast = sortItemsSmallFirst(cast, "name");

            cy.get(".MuiCardActions-root").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var name = cast[index].name.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("a").contains(name);
            });
        });

        it("Sorts by popularity", () => {
            cy.get("[id='sort-select']").click();
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
            cy.get("[id='sort-select']").click();
            cy.get("li").contains("Alphabetical").click();
            cy.get("[id='sort-select']").click();
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
            cy.get("[id='sort-select']").click();
            cy.get("li").contains("Alphabetical").click();
            const crew1 = sortItemsSmallFirst(crew, "name");

            cy.get(".MuiCardActions-root").each(($card, index) => {
                //Necessary to prevent errors when API returns double spacing.
                var name = crew1[index].name.replace( /\s\s+/g, ' ' );
                cy.wrap($card).find("a").contains(name);
            });
        });

        it("Sorts by popularity", () => {
            cy.get("[id='sort-select']").click();
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