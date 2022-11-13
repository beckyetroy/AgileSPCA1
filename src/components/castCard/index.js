import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import maleImg from '../../images/male-person-placeholder.jpg';
import femaleImg from '../../images/female-person-placeholder.jpg';
import { Link } from "react-router-dom";

export default function CastCard({ cast }) {

  return (
    <Card sx={{ maxWidth: '100%', minHeight: 350}}>
      <CardMedia
        sx={{ height: 210 }}
        image={
          cast.profile_path
            ? `https://image.tmdb.org/t/p/w500/${cast.profile_path}`
            : cast.gender === 1 ? femaleImg 
            : maleImg
        }
      />
      <CardHeader sx={{minHeight: 20}} style={{justifyContent:"center", padding:0}} align="center"
        title={
            <CardActions disableSpacing style={{justifyContent:"center"}}>
            <Typography variant="h7" component="p" align="center" style={{justifyContent:"center"}}>
              <Link to={`/person/${cast.id}`} style={{ textDecoration: 'none', fontSize: '0.75em', justifyContent:"center", color:'#ac00e6'}}>
                {cast.name}{" "}
              </Link>
            </Typography>
      </CardActions>
        }
      />
      <CardContent style={{justifyContent:"center", paddingTop:0}} align="center">
        <Typography variant="h7" component="p" style={{fontStyle: "italic", fontFamily: "sans-serif"}}>
            {cast.character}
        </Typography>
      </CardContent>
    </Card>
  );
}