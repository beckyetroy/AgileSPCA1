import React, { lazy, Suspense } from "react";
import { useParams } from 'react-router-dom';
import { getMovie } from '../api/tmdb-api';
import { useQuery } from "react-query";
import Spinner from '../components/spinner';
const MovieDetails = lazy(() => import("../components/movieDetails/"));
const PageTemplate = lazy(() => import("../components/templateMoviePage"));

const MoviePage = (props) => {
  const { id } = useParams();
  const { data: movie, error, isLoading, isError } = useQuery(
    ["movie", { id: id }],
    getMovie
  );

  if (isLoading) {
    return (
      <Spinner />
    );
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return (
    <>
      {movie ? (
        <>
        <Suspense fallback={<h1>Building Movie Details Page</h1>}>
          <PageTemplate movie={movie} >
            <MovieDetails movie={movie}/>
          </PageTemplate>
        </Suspense>
        </>
      ) : (
        <p>Waiting for movie details</p>
      )}
    </>
  );
};

export default MoviePage;