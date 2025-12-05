import React from "react";
import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import Header from '../Header/Header.js';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import './UserPreferencePage.css';
import { GoDotFill } from "react-icons/go";
import { FaLocationDot } from "react-icons/fa6";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import PageLayout from '../PageLayout/PageLayout.js';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Input from '@mui/material/Input';
import Autocomplete from "@mui/material/Autocomplete";
import Slider from "@mui/material/Slider";

function UserPreferencePage() {

  const personalityOptions = [
    "Playful",
    "Loyal",
    "Good with kids",
    "Intelligent",
    "Active",
    "Vocal",
    "High-energy",
    "Curious",
    "Energetic",
    "Gentle",
    "Calm",
    "Quiet",
    "Stubborn",
    "Alert",
    "Independent",
    "Protective",
    "Clownish",
    "Feisty",
    "Affectionate"
  ];
  const breedOptions = [
    "Golden Retriever",
    "German Shepherd",
    "Husky",
    "Beagle",
    "Labrador Retriever",
    "Pit Bull Terrier",
    "Border Collie",
    "Poodle",
    "Corgi",
    "Shiba Inu",
    "Boxer",
    "Chihuahua",
    "Great Dane",
    "Australian Shepherd",
    "Pomeranian"
  ];
  const [preferences, setPreferences] = useState({
      breed: [],
      ageRange: [2,5],
      gender: "",
      size: "",
      location: "",
      traits: []
    });
    const handleChange=(field, value) => {
      setPreferences((prev) => ({
        ...prev,
        [field]: value
      }));
    };
    const handleTraitToggle = (trait) => {
        //console.log(trait);
      setPreferences(prev => ({
        ...prev,
        traits: prev.traits.includes(trait)
          ? prev.traits.filter(t => t !== trait)
          : [...prev.traits, trait]
      }));
    };
  return (
   <PageLayout>
        <Box class="form-container">
            <Typography variant="h5">Find your pet!</Typography>
             <Autocomplete multiple options={breedOptions} value={preferences.breed} color="primary"
                    onChange={(e, newValue) => handleChange("breed",newValue)}
                    renderTags={(selected, getTagProps) =>
                      selected.map((option, index) => (
                        <Chip key={option} label={option} {...getTagProps({index })} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Preferred Breeds" placeholder="Choose upto 5 breeds" />
                    )} />
            <div>
            <Typography variant="body1">Preferred Age Range</Typography>
           <Slider value={preferences.ageRange}  onChange={(e, newValue) => handleChange("ageRange", newValue)} valueLabelDisplay="auto"
               min={0}
               max={15} />
            </div>
            <TextField label="Preferred Location" value={preferences.location} onChange={(e)=> handleChange("location",e.target.value)} />

            <div>
            <Typography variant="body1">
                Personality Traits
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                {personalityOptions.map((trait, idx) => (

                  <Chip key={idx} label={trait} color="primary" clickable variant={preferences.traits.includes(trait)? "filled" : "outlined"}  onClick={() => handleTraitToggle(trait)}
                  />
                ))}
              </Stack>
            </div>
            <Button className="submit-button">Submit Preferences</Button>
        </Box>
    </PageLayout>
  );
}

export default UserPreferencePage;
