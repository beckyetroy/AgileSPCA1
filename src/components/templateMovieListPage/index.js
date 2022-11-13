import React, { useState } from "react";
import Header from "../headerMovieList";
import FilterCard from "../filterMoviesCard";
import FilterTrendingCard from "../filterTrendingMoviesCard.js";
import PaginatedMovies from "../movieList";
import Grid from "@mui/material/Grid";

function MovieListPageTemplate({ movies, title, action }) {
  const [nameFilter, setNameFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState([]);
  const [sortFilter, setSortFilter] = useState("Popularity");
  const [sortType, setSortType] = useState("popularity");
  const [timeFilter] = useState(() => 
      (title.includes("Today") ? "Today" : "This Week"));

  let displayedMovies = movies
    .filter((m) => {
      return m.title.toLowerCase().search(nameFilter.toLowerCase()) !== -1;
    })
    .filter((m) => {
      return genreFilter.length > 0 ? m.genre_ids.some(id => genreFilter.includes(id)) : true;
    })
    .sort((m1, m2) => (
      (m1[sortType] < m2[sortType]) ? 1 : (m1[sortType] > m2[sortType]) ? -1 : 0
    ));

  if (sortType === "title") displayedMovies = displayedMovies.reverse();

  const handleChange = (type, value) => {
    if (type === "name") setNameFilter(value);
    else if (type === "genre") {
      setGenreFilter(value);
    }
    else if (type === "sort") {
      setSortFilter(value);
      if (value ==="Popularity") setSortType("popularity");
      else if (value === "Rating") setSortType("vote_average");
      else if (value === "Alphabetical") setSortType("title");
      else if (value === "Release Date") setSortType("release_date");
    }
  };

  return (
    <Grid container sx={{ padding: '1%', marginTop: -5 }}>
      <Grid item xs={12}>
        <Header title={title} />
      </Grid>
      <Grid item container spacing={5}>
        <Grid key="find" item xs={12} sm={6} md={4} lg={3} xl={2}>
        {title.includes("Trending") ? (
          <FilterTrendingCard
            onUserInput={handleChange}
            titleFilter={nameFilter}
            genreFilter={genreFilter}
            timeFilter={timeFilter}
            sortFilter={sortFilter}
          />
        ) :
          <FilterCard
            onUserInput={handleChange}
            titleFilter={nameFilter}
            genreFilter={genreFilter}
            sortFilter={sortFilter}
          />
        }
        </Grid>
        <PaginatedMovies action={action} movies={displayedMovies} moviesPerPage={7}></PaginatedMovies>
      </Grid>
    </Grid>
  );
}
export default MovieListPageTemplate;