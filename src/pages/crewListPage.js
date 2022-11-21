import React, { lazy, Suspense } from "react";
import { getMovieCredits } from "../api/tmdb-api";
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
const PageTemplate = lazy(() => import('../components/templateCrewListPage'));
const Spinner = lazy(() => import('../components/spinner'));

const CrewListPage = (props) => {
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

  var seen = {};
  const crews = data.crew.filter(function(entry) {
    var previous;

    if (seen.hasOwnProperty(entry.id)) {
        previous = seen[entry.id];
        previous.job = previous.job + ', ' + entry.job;
        return false;
    }

    seen[entry.id] = entry;
    return true;
});;

  return (
    <Suspense fallback={<h1>Building Page</h1>}>
      <PageTemplate
        title='Crew'
        crews={crews}
      />
    </Suspense>
  );
};
export default CrewListPage;