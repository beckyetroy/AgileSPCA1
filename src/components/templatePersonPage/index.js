import React from "react";
import PersonHeader from "../headerPerson";
import Grid from "@mui/material/Grid";
import maleImg from '../../images/male-person-placeholder.jpg';
import femaleImg from '../../images/female-person-placeholder.jpg';

const TemplatePersonPage = ({ person, children }) => {

  return (
    <>
      <PersonHeader person={person} />

      <Grid container spacing={5} sx={{ padding: "2%" }}>
        <Grid item xs={12} sm={4}>
          <div sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}>
          <img alt={person.name} style={{maxWidth:"100%", border: "solid medium #3399ff"}}src={ person.profile_path
                ? `https://image.tmdb.org/t/p/w500/${person.profile_path}`
                : person.gender === 1 ? femaleImg 
                : maleImg
            }
        />
          </div>
        </Grid>

        <Grid item xs={12} sm={8}>
          {children}
        </Grid>
      </Grid>
    </>
  );
};

export default TemplatePersonPage;