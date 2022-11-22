import React, { lazy, Suspense } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import img from '../../images/pexels-dziana-hasanbekava-5480827.jpg'
import { getGenres } from "../../api/tmdb-api";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';
const Spinner = lazy(() => import('../spinner'));

const formControl = 
  {
    margin: 1,
    minWidth: 220,
    backgroundColor: "rgb(255, 255, 255)"
  };

export default function FilterTrendingCard(props) {
  const navigate = useNavigate();

  const { data, error, isLoading, isError } = useQuery("genres", getGenres);

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
  const genres = data.genres;

  const handleChange = (e, type, value) => {
    e.preventDefault();
    props.onUserInput(type, value); // NEW
  };

  const handleTextChange = (e, props) => {
    handleChange(e, "name", e.target.value);
  };

  const handleGenreChange = (e, value) => {
    const genres = value.map(genre => genre.id);
    handleChange(e, "genre", genres);
  };

  const times = ["This Week", "Today"];
  const sorts = ["Alphabetical", "Popularity", "Rating", "Release Date"];

  const handleTimeChange = (e) => {
    handleChange(e, "time", e.target.value);
    if (e.target.value === "Today") navigate('/movies/trending/today');
    else navigate('/movies/trending/week');
  };

  const handleSortChange = (e, props) => {
    handleChange(e, "sort", e.target.value);
  };

  return (
    <Card 
      sx={{
        maxWidth: 345,
        backgroundColor: "rgb(204, 204, 0)"
      }} 
      variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h1">
          <SearchIcon fontSize="large" />
          Filter Movies
        </Typography>
        <TextField
          sx={{...formControl}}
          id="filled-search"
          label="Search field"
          type="search"
          variant="filled"
          value={props.titleFilter}
          onChange={handleTextChange}
        />
        <FormControl sx={{...formControl}}>
          <InputLabel id="time-label">Trending</InputLabel>
          <Select
            labelId="time-label"
            id="time-select"
            defaultValue=""
            value={props.timeFilter}
            onChange={handleTimeChange}
          >
            {times.map((time) => {
              return (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl sx={{...formControl}}>
          <Autocomplete
            multiple
            id="genre-select"
            options={genres}
            getOptionLabel={(genre) => String(genre.name)}
            filterSelectedOptions
            onChange={handleGenreChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Genres"
              />
            )}
          />
        </FormControl>
        <FormControl sx={{...formControl}}>
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select
            labelId="sort-label"
            id="sort-select"
            defaultValue=""
            value={props.sortFilter}
            onChange={handleSortChange}
          >
            {sorts.map((sort) => {
              return (
                <MenuItem key={sort} value={sort}>
                  {sort}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </CardContent>
      {window.screen.availWidth > 600 ? (
        <CardMedia
          sx={{ height: 300 }}
          image={img}
          title="Filter"
        />
      ): (null) }
      {window.screen.availWidth > 600 ? (
      <CardContent>
        <Typography variant="h5" component="h1">
          <SearchIcon fontSize="large" />
          Filter Movies
          <br />
        </Typography>
      </CardContent>
      ): (null) }
    </Card>
  );
}