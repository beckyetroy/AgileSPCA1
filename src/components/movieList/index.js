import React, { useState } from "react";
import Movie from "../movieCard";
import Grid from "@mui/material/Grid";
import ReactPaginate from 'react-paginate';
import './index.css';

const MovieList = ( {movies, action }) => {
  let movieCards = movies.map((m) => (
    <Grid key={m.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
      <Movie key={m.id} movie={m} action={action} />
    </Grid>
  ));
  return movieCards;
};

const PaginatedMovies = ({ movies, moviesPerPage, action })  => {
  const [movieOffset, setMovieOffset] = useState(0);

  const endOffset = movieOffset + moviesPerPage;
  const currentMovies = movies.slice(movieOffset, endOffset);
  const pageCount = Math.ceil(movies.length / moviesPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * moviesPerPage) % movies.length;
    setMovieOffset(newOffset);
  };

  return (
    <>
      <MovieList movies={currentMovies} action={action} />
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

export default PaginatedMovies;