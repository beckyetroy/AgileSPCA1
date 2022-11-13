import React from "react";
import { getMovieCredits } from "../api/tmdb-api";
import PageTemplate from '../components/templateCrewListPage';
import { useQuery } from 'react-query';
import Spinner from '../components/spinner';
import { useParams } from 'react-router-dom';

const CrewListPage = (props) => {
  const { id } = useParams();
  const {  data, error, isLoading, isError }  = useQuery(
    ["credits", { id: id }],
    getMovieCredits
  );

  if (isLoading) {
    return <Spinner />
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
    <PageTemplate
      title='Crew'
      crews={crews}
    />
  );
};
export default CrewListPage;