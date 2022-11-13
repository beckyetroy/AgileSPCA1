import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { useForm, Controller } from "react-hook-form";
import React, { useState, useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

const styles = {
  root: {
    marginTop: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
  },
  form: {
    width: "100%",
    "& > * ": {
      marginTop: 2,
    },
  },
  textField: {
    width: "40ch",
  },
  submit: {
    marginRight: 2,
  },
  snack: {
    width: "50%",
    "& > * ": {
      width: "100%",
    },
  },
};

const ReviewForm = ({ movie }) => {
  const context = useContext(MoviesContext);
  const [rating, setRating] = useState(3);
  const [open, setOpen] = useState(false); 
  const navigate = useNavigate();

  const defaultValues = {
    author: "",
    review: "",
    agree: false,
    rating: 3,
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm(defaultValues);

  const handleRatingChange = (event) => {
    setRating(Number(event.target.value));
  };

  const onSubmit = (review) => {
    review.movieId = movie.id;
    review.rating = rating;
    context.addReview(movie, review);
    setOpen(true); // NEW
  };

  const handleSnackClose = (event) => {
    setOpen(false);
    navigate("/movies/favorites");
  };

  return (
    <Box component="div" sx={styles.root}>
      <Typography component="h2" variant="h3">
        Submit Your Review
      </Typography>

      <Snackbar
        sx={styles.snack}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={handleSnackClose}
      >
        <MuiAlert
          severity="success"
          variant="filled"
          onClose={handleSnackClose}
        >
          <Typography variant="h4">
            Thank you for submitting a review
          </Typography>
        </MuiAlert>
      </Snackbar>

      <form sx={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="author"
          control={control}
          rules={{ required: "Name is required" }}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextField
              sx={{ width: "40ch" }}
              variant="outlined"
              margin="normal"
              required
              onChange={onChange}
              value={value}
              id="author"
              label="Author's name"
              name="author"
              autoFocus
            />
          )}
        />
        {errors.author && (
          <Typography variant="h6" component="p">
            {errors.author.message}
          </Typography>
        )}
        <Controller
          name="review"
          control={control}
          rules={{
            required: "Review cannot be empty.",
            minLength: { value: 10, message: "Review is too short" },
          }}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="review"
              value={value}
              onChange={onChange}
              label="Review text"
              id="review"
              multiline
              minRows={10}
            />
          )}
        />
        {errors.review && (
          <Typography variant="h6" component="p">
            {errors.review.message}
          </Typography>
        )}

        <Controller
          control={control}
          name="rating"
          render={({ field: { onChange, value } }) => (
            <Rating
              name="rating"
              value={rating}
              size="large"
              sx={{
                fontSize: "4rem"
              }}
              onChange={handleRatingChange}
            />
          )}
        />

        <Box sx={styles.buttons}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={styles.submit}
          >
            Submit
          </Button>
          <Button
            type="reset"
            variant="contained"
            color="secondary"
            sx={styles.submit}
            onClick={() => {
              reset({
                author: "",
                content: "",
              });
            }}
          >
            Reset
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ReviewForm;