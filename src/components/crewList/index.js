import React, { useState } from "react";
import Crew from "../crewCard";
import Grid from "@mui/material/Grid";
import ReactPaginate from 'react-paginate';
import '../movieList/index.css';

const CrewList = ( {crews, action }) => {
  let crewCards = crews.map((c) => (
    <Grid key={c.credit_id} item xs={12} sm={5} md={3} lg={2} xl={1}>
      <Crew key={c.credit_id} crew={c} action={action} />
    </Grid>
  ));
  return crewCards;
};

const PaginatedCrew = ({ crews, crewsPerPage, action })  => {
  const [crewOffset, setCrewOffset] = useState(0);

  const endOffset = crewOffset + crewsPerPage;
  const currentCrew = crews.slice(crewOffset, endOffset);
  const pageCount = Math.ceil(crews.length / crewsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * crewsPerPage) % crews.length;
    setCrewOffset(newOffset);
  };

  return (
    <>
      <CrewList crews={currentCrew} action={action} />
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next →"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="← Previous"
        renderOnZeroPageCount={null}
        containerClassName={"pagination"}
        previousLinkClassName={"pagination__link"}
        nextLinkClassName={"pagination__link"}
        disabledClassName={"pagination__link--disabled"}
        activeClassName={"pagination__link--active"}
      />
    </>
  );
}

export default PaginatedCrew;