import React, { lazy, Suspense } from "react";
import { useParams } from 'react-router-dom';
import { getPersonDetails } from '../api/tmdb-api';
import { useQuery } from "react-query";
import Spinner from '../components/spinner';
const PersonDetails = lazy(() => import("../components/personDetails/"));
const PageTemplate = lazy(() => import("../components/templatePersonPage"));

const PersonPage = (props) => {
  const { id } = useParams();
  const { data: person, error, isLoading, isError } = useQuery(
    ["personDetails", { id: id }],
    getPersonDetails
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
      {person ? (
        <>
        <Suspense fallback={<h1>Building Person Details Page</h1>}>
          <PageTemplate person={person} >
            <PersonDetails person={person}/>
          </PageTemplate>
        </Suspense>
        </>
      ) : (
        <p>Waiting for person details</p>
      )}
    </>
  );
};

export default PersonPage;