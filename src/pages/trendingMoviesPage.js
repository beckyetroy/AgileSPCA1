import React, { lazy, Suspense } from "react";
import { getTrendingMovies } from "../api/tmdb-api";
import { useQuery } from 'react-query';
const PageTemplate = lazy(() => import('../components/templateMovieListPage'));
const Spinner = lazy(() => import('../components/spinner'));
const AddToFavoritesIcon = lazy(() => import('../components/cardIcons/addToFavorites'));

const TrendingMoviesPageWeek = (props) => {
  const time = "week";
  const {  data, error, isLoading, isError }  = useQuery('discoverTrendingThisWeek', () => getTrendingMovies(time));

  if (isLoading) {
    return (
      <Suspense fallback={<h1>Building Spinner</h1>}>
        <Spinner />
      </Suspense>
    );
  }

  if (isError) {
    return <h1>{error.message}</h1>
  }
  const movies = data.results;

  // Redundant, but necessary to avoid app crashing.
  const favorites = movies.filter(m => m.favorite)
  localStorage.setItem('favorites', JSON.stringify(favorites))
  //const addToFavorites = (movieId) => true

  return (
    <Suspense fallback={<h1>Building Trending Movies Page</h1>}>
      <PageTemplate
        title='Trending This Week'
        movies={movies}
        action={(movie) => {
          return <AddToFavoritesIcon movie={movie} />
        }}
      />
    </Suspense>
  );
};

const TrendingMoviesPageDay = (props) => {
  const time = "day";
  const {  data, error, isLoading, isError }  = useQuery('discoverTrendingToday', () => getTrendingMovies(time));

  if (isLoading) {
    return (
      <Suspense fallback={<h1>Building Spinner</h1>}>
        <Spinner />
      </Suspense>
    );
  }

  if (isError) {
    return <h1>{error.message}</h1>
  }  
  const movies = data.results;

  // Redundant, but necessary to avoid app crashing.
  const favorites = movies.filter(m => m.favorite)
  localStorage.setItem('favorites', JSON.stringify(favorites))
  //const addToFavorites = (movieId) => true

  return (
    <Suspense fallback={<h1>Building Trending Movies Page</h1>}>
      <PageTemplate
        title='Trending Today'
        movies={movies}
        action={(movie) => {
          return <AddToFavoritesIcon movie={movie} />
        }}
      />
    </Suspense>
  );
};
export { TrendingMoviesPageWeek, TrendingMoviesPageDay};