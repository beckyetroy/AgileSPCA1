import React from "react";
import { getMovieCredits } from "../api/tmdb-api";
import PageTemplate from '../components/templateCastListPage';
import { useQuery } from 'react-query';
import Spinner from '../components/spinner';
import { useParams } from 'react-router-dom';

const CastListPage = (props) => {
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

  const casts = data.cast;

  return (
    <PageTemplate
      title='Cast'
      casts={casts}
    />
  );
};
export default CastListPage;