import { filterByCharacter, filterByJob, filterByName } from '../support/e2e';

let cast; // List of cast members for a particular movie
let crew; //List of crew members for a particular movie
var seen = {}; //Used for filtering crew list (see crew list page tests)
let movies; // List of Discover movies from TMDB

describe("Filtering People", () => {
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