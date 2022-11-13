import React from "react";
import MovieHeader from "../headerMovie";
import Grid from "@mui/material/Grid";
import { getMovieImages } from "../../api/tmdb-api";
import { useQuery } from "react-query";
import Spinner from '../spinner';
import Carousel from 'react-material-ui-carousel';

const TemplateMoviePage = ({ movie, children }) => {
  const { data , error, isLoading, isError } = useQuery(
    ["images", { id: movie.id }],
    getMovieImages
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }
  const images = data.posters 

  return (
    <>
      <MovieHeader movie={movie}/>

      <Grid container spacing={5} sx={{ padding: '1%'}}>
        <Grid item xs={12} sm={4}>
          <div sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}>
            <Carousel 
                cols={1}>
                {images.map((image) => (
                    <Item key={image.file_path} image = {image} cols={1} />
                ))}
            </Carousel>
          </div>
        </Grid>

        <Grid item xs={12} sm={8}>
          {children}
        </Grid>
      </Grid>
    </>
  );
};

function Item(props)
{
    return (
      <img
        src={`https://image.tmdb.org/t/p/w500/${props.image.file_path}`}
        alt={props.image.poster_path}
      />
    )
}

export default TemplateMoviePage;