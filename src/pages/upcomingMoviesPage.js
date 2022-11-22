import React, { lazy, Suspense } from "react";
import { getUpcomingMovies } from "../api/tmdb-api";
import { useQuery } from 'react-query';
import Spinner from '../components/spinner';
import AddToMustWatch from "../components/cardIcons/addToMustWatch";
const PageTemplate = lazy(() => import('../components/templateMovieListPage'));

const UpcomingMoviesPage = (props) => {

  const {  data, error, isLoading, isError }  = useQuery('discoverUpcoming', getUpcomingMovies)

  if (isLoading) {
    return (
      <Spinner />
    );
  }

  if (isError) {
    return <h1>{error.message}</h1>
  }  
  const movies = data.results;

  // Redundant, but necessary to avoid app crashing.
  const mustWatch = movies.filter(m => m.mustWatch)
  localStorage.setItem('mustWatch', JSON.stringify(mustWatch))
  //const addToMustWatch = (movieId) => true 

  return (
    <Suspense fallback={<h1>Building Upcoming Movies Page</h1>}>
      <PageTemplate
        title='Upcoming Movies'
        movies={movies}
        action={(movie) => {
          return <AddToMustWatch movie={movie} />
        }}
      />
    </Suspense>
  );
};
export default UpcomingMoviesPage;