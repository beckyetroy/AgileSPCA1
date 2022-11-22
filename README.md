# Assignment 1 - Agile Software Practice.

__Name:__ Rebecca Troy

This repository contains the implementation of a React App and its associated Cypress tests and GitLab CI pipeline.

## React App Features.

This section details the features that have been added to the application as part of Web App Dev
CA1, as well as the pre-existing features that have been modified.
 
+ Trending Movies Page
+ Filter Card for trending movies page with additional option to filter by trending
'this week' or 'today'
+ Cast List for every movie
+ Filter Card for cast list page - search cast by name or character
+ Crew List for every movie
+ Filter Card for crew list page - search crew by name or job
+ Person Details Page (for cast / crew members)
+ Must-Watch feature now fully functional with cache, with 'Must-Watch' movies page similar
to 'Favorites'
+ 'Sort By' filter on all movies, cast, and crew list pages
+ Pagination on all list pages
+ Responsive UI on all pages
+ Session generation and authentication on index page load
+ New MUI Components rating, carousel, autocomplete

## Automated Tests.
+ cypress/e2e/base_movie.cy.js - tests the rendering, display, and navigation of the Movie Details Page, the Review Details
Page / List view, the Cast List Page, the Crew List Page, and the Person Details Page.
+ cypress/e2e/base_movies.cy.js - tests the rendering, display, and navigation of the Discover Movies page, the Favourites
Page, the Upcoming Movies Page, the Must Watch Page, and the Trending Page.
+ cypress/e2e/favorites.cy.js - tests the full functionality of the favorites feature.
+ cypress/e2e/filtering_movies.cy.js - tests the full functionality of filtering through the Discover Movies page, the Favourites
Page, the Upcoming Movies page, the Must Watch page, and the Trending Movies Page.
+ cypress/e2e/filtering_people.cy.js - tests the full functionality of filtering through the Cast List page and the Crew List
page.
+ cypress/e2e/mustwatch.cy.js - tests the full functionality of the favorites feature.
+ cypress/e2e/pagination.cy.js - tests the full functionality of the pagination feature on the Discover Movies page, the Upcoming Movies page, the Trending Movies Pag, the Cast List page, and the Crew List page.
+ cypress/e2e/sorting_movies.cy.js - tests the full functionality of sorting movies on the Discover Movies page, the Favourites
Page, the Upcoming Movies page, the Must Watch page, and the Trending Movies Page.
+ cypress/e2e/sorting_people.cy.js - tests the full functionality of sorting movies on the Cast List page and the Crew List
page.

### Best test cases.

Below lists the pathnames of the two test files I feel best represent my knowledge and understanding of Cypress testing code. I
chose these as they particularly demonstrate Error/Exception handling, nested test case structure, and thorough functionality.

+ cypress/e2e/filtering_movies.cy.js
+ cypress/e2e/mustwatch.cy.js

### Cypress Custom commands.

The following files make use of Cypress custom commands:

e.g.
+ cypress/e2e/filtering.cy.js
+ cypress/e2e/favourites.cy.js

## Code Splitting.

Below lists the pathnames of each file which contains evidence of code 
splitting in the app. I carried out this everywhere applicable for my app.

+ src/index.js
+ src/components/filterTrendingMoviesCard/index.js
+ src/pages/addMovieReviewPage.js
+ src/pages/castListPage.js
+ src/pages/crewListPage.js
+ src/pages/favoriteMoviesPage.js
+ src/pages/homePage.js
+ src/pages/movieDetailsPage.js
+ src/pages/movieReviewPage.js
+ src/pages/mustWatchMoviesPage.js
+ src/pages/personDetailsPage.js
+ src/pages/trendingMoviesPage.js
+ src/pages/upcomingMoviesPage.js

## Pull Requests.

[ Specify the URL of the GitHub repository that contains a record of Pull Requests for the React App.]

## Independent learning (If relevant).

[ Briefly explain the work you did to satisfy the requirements of the Outstanding grade category, and include proof (e.g. screenshots) of its success. Also, mention the files that contain evidence of this work.

![](./images/sample.png)

State any other evidence of independent learning achieved while completing this assignment.
