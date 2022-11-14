let movies; // List of movies from TMDB
let movie; //

describe("Base tests", () => {

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
        });

        describe("The Discover Movies page", () => {
        it("displays the page header and 7 movies on first load", () => {
            cy.get("h3").contains("Discover Movies");
            cy.get(".MuiCardHeader-root").should("have.length", 7);
        });

        it("displays the correct movie titles", () => {
            cy.get(".MuiCardHeader-content").each(($card, index) => {
            //Necessary to prevent errors when API returns double spacing.
            var title = movies[index].title.replace( /\s\s+/g, ' ' );
            cy.wrap($card).find("p").contains(title);
            });
        });
        });
        describe("The Movie Details page", () => {
        before(() => {
            cy.request(
            `https://api.themoviedb.org/3/movie/${
                movies[0].id
            }?api_key=${Cypress.env("TMDB_KEY")}`
            )
            .its("body")
            .then((movieDetails) => {
                movie = movieDetails;
            });
        });
        beforeEach(() => {
            cy.visit(`/movies/${movies[0].id}`);
        });
        it(" displays the movie title, overview and genres ", () => {
            //Necessary to prevent errors when API returns double spacing.
            var title = movie.title.replace( /\s\s+/g, ' ' );
            cy.get("h3").contains(title);
            cy.get("h3").contains("Overview");

            //Necessary to prevent errors when API returns double spacing.
            var overview = movie.overview.replace( /\s\s+/g, ' ' );
            cy.get("p").contains(overview);
            cy.get("ul")
            .eq(0)
            .within(() => {
                const genreChipLabels = movie.genres.map((g) => g.name);
                genreChipLabels.unshift("Genres");
                cy.get("span").each(($card, index) => {
                cy.wrap($card).contains(genreChipLabels[index]);
                });
            });
        });
    });
});