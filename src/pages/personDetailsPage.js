import React, { lazy, Suspense } from "react";
import { useParams } from 'react-router-dom';
import { getPersonDetails } from '../api/tmdb-api';
import { useQuery } from "react-query";
const PersonDetails = lazy(() => import("../components/personDetails/"));
const PageTemplate = lazy(() => import("../components/templatePersonPage"));
const Spinner = lazy(() => import ('../components/spinner'));

const PersonPage = (props) => {
  const { id } = useParams();
  const { data: person, error, isLoading, isError } = useQuery(
    ["personDetails", { id: id }],
    getPersonDetails
  );

  if (isLoading) {
    return (
      <Suspense fallback={<h1>Building Spinner</h1>}>
        <Spinner />
      </Suspense>
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