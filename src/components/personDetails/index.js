import React from "react";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import PlaceIcon from '@mui/icons-material/Place';
import Typography from "@mui/material/Typography";

const root = {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: 1.5,
    margin: 0,
};

const PersonDetails = ({ person }) => {

    function getAge(date) {
        var today = new Date();
        var birthDate = new Date(date);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

  return (
    <>
      <Typography variant="h5" component="h3"  style={{textDecoration: 'underline', 
        textAlign: 'center', paddingBottom: '1em'}}>
      {person.biography ?
          'Biography'
        : `Biography for ${person.name} unavailable` }
      </Typography>

      <Typography variant="h7" component="p" style={{paddingBottom: '1em', textAlign: 'justify'}}>
        {person.biography}
      </Typography>
      <Paper component="ul" sx={{...root}}>
      {person.birthday ?
        <Chip label={`Born: ${person.birthday}`} style={{backgroundColor: '#ffcc99', margin:'0.25em'}} />
        : <Chip label={`Born: N/A`} style={{backgroundColor: '#ffcc99', margin:'0.25em'}}/>}
        {person.deathday ?
            <Chip label={`Died: ${person.deathday}`} style={{backgroundColor: '#ff6666', margin:'0.25em'}}/>
        : person.birthday ?
        <Chip label={`Age: ${getAge(person.birthday)}`} style={{backgroundColor: '#ffcc99', margin:'0.25em'}} />
        : <Chip label={`Age: Unknown`} style={{backgroundColor: '#ffcc99', margin:'0.25em'}} />}
        {person.gender === 2 ?
            <Chip icon={<MaleIcon />} label={`Male`} style={{backgroundColor: '#99ccff', margin:'0.25em'}}/>
        : person.gender === 1 ?
          <Chip icon={<FemaleIcon />} label={`Female`} style={{backgroundColor: '#ffccff', margin:'0.25em'}} /> 
        : <Chip label={`Gender: N/B or Unknown`} style={{margin:'0.25em'}} />}
        {person.place_of_birth ?
        <Chip
          icon={<PlaceIcon />}
          label={`From: ${person.place_of_birth}`}
          style={{backgroundColor: '#ffff66', margin:'0.25em'}}
        />
        : <Chip
        icon={<PlaceIcon />}
        label={`From: N/A`}
        style={{backgroundColor: '#ffff66', margin:'0.25em'}}
        />}
        <Chip label={`Known for: ${person.known_for_department}`} style={{backgroundColor: '#00cc66', margin:'0.25em'}}
        />
      </Paper>
      </>
  );
};
export default PersonDetails;