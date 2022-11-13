import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const PersonHeader = (props) => {
  const person = props.person;
  const navigate = useNavigate();

  return (
    <Paper 
        component="div" 
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
          padding: '1%',
          margin: -5,
          textAlign: 'center',
        }}
      >
      <IconButton aria-label="go back" onClick={() => navigate(-1)} >
        <ArrowBackIcon color="primary" fontSize="large" />
      </IconButton>

      <Typography variant="h3" component="h3" sx={{fontSize:'2.4em'}}>
        {person.name}
      </Typography>

      <IconButton aria-label="go forward" onClick={() => navigate(+1) } >
        <ArrowForwardIcon color="primary" fontSize="large" />
      </IconButton>
    </Paper>
  );
};

export default PersonHeader;