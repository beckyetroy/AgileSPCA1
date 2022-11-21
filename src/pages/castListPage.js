import React, { lazy, Suspense } from "react";
import { getMovieCredits } from "../api/tmdb-api";
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
const PageTemplate = lazy(() => import('../components/templateCastListPage'));
const Spinner = lazy(() => import('../components/spinner'));

const CastListPage = (props) => {
  const { id } = useParams();
  const {  data, error, isLoading, isError }  = useQuery(
    ["credits", { id: id }],
    getMovieCredits
  );

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

  const casts = data.cast;

  return (
    <Suspense fallback={<h1>Building Page</h1>}>
      <PageTemplate
        title='Cast'
        casts={casts}
      />
    </Suspense>
  );
};
export default CastListPage;