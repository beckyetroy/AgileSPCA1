import React, { useState } from "react";
import Header from "../headerMovieList";
import FilterCard from "../filterCastCard";
import PaginatedCast from "../castList";
import Grid from "@mui/material/Grid";

function CastListPageTemplate({ casts, title, action }) {
  const [nameFilter, setNameFilter] = useState("");
  const [characterFilter, setCharacterFilter] = useState("");
  const [sortFilter, setSortFilter] = useState("Relevance");
  const [sortType, setSortType] = useState("order");

  let displayedCasts = casts
    .filter((c) => {
      return c.name.toLowerCase().search(nameFilter.toLowerCase()) !== -1;
    })
    .filter((c) => {
      return c.character.toLowerCase().search(characterFilter.toLowerCase()) !== -1;
    })
    .sort((c1, c2) => (
      (c1[sortType] > c2[sortType]) ? 1 : (c1[sortType] < c2[sortType]) ? -1 : 0
    ));

  if (sortType === "popularity") displayedCasts = displayedCasts.reverse();

  const handleChange = (type, value) => {
    if (type === "name") setNameFilter(value);
    else if (type === "character") setCharacterFilter(value);
    else if (type === "sort") {
      setSortFilter(value);
      if (value ==="Popularity") setSortType("popularity");
      else if (value === "Relevance") setSortType("order");
      else if (value === "Alphabetical") setSortType("name");
    }
  };

  return (
    <Grid container sx={{ padding: '1%', marginTop: -5 }}>
      <Grid item xs={12}>
        <Header title={title} />
      </Grid>
      <Grid item container spacing={1}>
        <Grid key="find" item xs={12} sm={5} md={3} lg={2} xl={1.5}>
          <FilterCard
            onUserInput={handleChange}
            actorFilter={nameFilter}
            characterFilter={characterFilter}
            sortFilter={sortFilter}
          />
        </Grid>
        <PaginatedCast action={action} casts={displayedCasts} castsPerPage={11}></PaginatedCast>
      </Grid>
    </Grid>
  );
}
export default CastListPageTemplate;