import React, { useContext, lazy, Suspense } from "react";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "react-query";
import { getMovie } from "../api/tmdb-api";
const PageTemplate = lazy(() => import("../components/templateMovieListPage"));
const Spinner = lazy(() => import('../components/spinner'));
const RemoveFromFavorites = lazy(() => import("../components/cardIcons/removeFromFavorites"));
const WriteReview = lazy(() => import("../components/cardIcons/writeReview"));

const FavoriteMoviesPage = () => {
  const {favorites: movieIds } = useContext(MoviesContext);

  // Create an array of queries and run in parallel.
  const favoriteMovieQueries = useQueries(
    movieIds.map((movieId) => {
      return {
        queryKey: ["movie", { id: movieId }],
        queryFn: getMovie,
      };
    })
  );
  // Check if any of the parallel queries is still loading.
  const isLoading = favoriteMovieQueries.find((m) => m.isLoading === true);

  if (isLoading) {
    return (
      <Suspense fallback={<h1>Building Spinner</h1>}>
        <Spinner />
      </Suspense>
    );
  }

  const movies = favoriteMovieQueries.map((q) => {
    q.data.genre_ids = q.data.genres.map(g => g.id)
    return q.data
  });

  //const toDo = () => true;

  return (
    <Suspense fallback={<h1>Building Favourites Page</h1>}>
      <PageTemplate
        title="Favorite Movies"
        movies={movies}
        action={(movie) => {
          return (
            <>
              <RemoveFromFavorites movie={movie} />
              <WriteReview movie={movie} />
            </>
          );
        }}
      />
    </Suspense>
  );
};

export default FavoriteMoviesPage;