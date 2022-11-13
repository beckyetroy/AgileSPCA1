import React, { useState } from "react";
import Header from "../headerMovieList";
import FilterCard from "../filterCrewCard";
import PaginatedCrew from "../crewList";
import Grid from "@mui/material/Grid";

function CrewListPageTemplate({ crews, title, action }) {
  const [nameFilter, setNameFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [sortFilter, setSortFilter] = useState("Default");
  const [sortType, setSortType] = useState("");

  let displayedCrews = crews
    .filter((c) => {
      return c.name.toLowerCase().search(nameFilter.toLowerCase()) !== -1;
    })
    .filter((c) => {
      return c.job.toLowerCase().search(jobFilter.toLowerCase()) !== -1;
    })
    .sort((c1, c2) => (
      (c1[sortType] > c2[sortType]) ? 1 : (c1[sortType] < c2[sortType]) ? -1 : 0
    ));

  if (sortType === "popularity") displayedCrews = displayedCrews.reverse();

  const handleChange = (type, value) => {
    if (type === "name") setNameFilter(value);
    else if (type === "job") setJobFilter(value);
    else if (type === "sort") {
      setSortFilter(value);
      if (value ==="Popularity") setSortType("popularity");
      else if (value === "Alphabetical") setSortType("name");
      else if (value === "Default") setSortType("");
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
            crewFilter={nameFilter}
            jobFilter={jobFilter}
            sortFilter={sortFilter}
          />
        </Grid>
        <PaginatedCrew action={action} crews={displayedCrews} crewsPerPage={11}></PaginatedCrew>
      </Grid>
    </Grid>
  );
}
export default CrewListPageTemplate;