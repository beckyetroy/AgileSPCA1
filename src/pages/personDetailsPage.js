import React from "react";
import { useParams } from 'react-router-dom';
import PersonDetails from "../components/personDetails/";
import PageTemplate from "../components/templatePersonPage";
import { getPersonDetails } from '../api/tmdb-api'
import { useQuery } from "react-query";
import Spinner from '../components/spinner'

const PersonPage = (props) => {
  const { id } = useParams();
  const { data: person, error, isLoading, isError } = useQuery(
    ["personDetails", { id: id }],
    getPersonDetails
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return (
    <>
      {person ? (
        <>
          <PageTemplate person={person} >
            <PersonDetails person={person}/>
          </PageTemplate>
        </>
      ) : (
        <p>Waiting for person details</p>
      )}
    </>
  );
};

export default PersonPage;