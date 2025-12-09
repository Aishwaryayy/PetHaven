import React from "react";
import {useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import Header from '../Header/Header.js';
import PageLayout from '../PageLayout/PageLayout.js';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import {Swiper,SwiperSlide} from "swiper/react";
import {Pagination, Navigation} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import './NewPetListingPage.css';

function NewPetListingPage() {
  const navigate = useNavigate();
  const { curr_id } = useParams();
  const personalityOptions = [
    "Playful","Loyal","Good with kids","Intelligent","Active","Vocal",
    "High-energy","Curious","Energetic","Gentle","Calm","Quiet",
    "Stubborn","Alert","Independent","Protective","Clownish","Feisty","Affectionate"
  ];

  const breedOptions = [
    "Golden Retriever","German Shepherd","Husky","Beagle","Labrador Retriever",
    "Pit Bull Terrier","Border Collie","Poodle","Corgi","Shiba Inu","Boxer",
    "Chihuahua","Great Dane","Australian Shepherd","Pomeranian"
  ];

  const [petData, setPetData] = useState({
    shelterId: "",
    species: "",
    name: "",
    age: "",
    gender: "",
    size: "",
    location: "",
    breed: [],
    photos: [],
    previewUrls: [],
    summary: "",
    routine: "",
    goodWithChildren: false,
    goodWithDogs: false,
    goodWithCats: false,
    traits: []
  });


  const handleChange = (field, value) => {
    setPetData(prev => ({ ...prev, [field]: value }));
  };

  const handleTraitToggle = (trait) => {
    setPetData(prev => ({
      ...prev,
      traits: prev.traits.includes(trait)
        ? prev.traits.filter(t => t !== trait)
        : [...prev.traits, trait]
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPetData(prev => ({ ...prev, photos: files, previewUrls: urls }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", petData.name);
    formData.append("age", petData.age);
    formData.append("gender", petData.gender);
    formData.append("size", petData.size);
    formData.append("location", petData.location);
    petData.breed.forEach(b => formData.append("breed[]", b));
    formData.append("profile[summary]", petData.summary);
    formData.append("profile[routine]", petData.routine);
    formData.append("profile[goodWithChildren]", petData.goodWithChildren);
    formData.append("profile[goodWithDogs]", petData.goodWithDogs);
    formData.append("profile[goodWithCats]", petData.goodWithCats);
    formData.append("shelterId",localStorage.getItem("shelterId"))
    petData.traits.forEach(t => formData.append("profile[personalityTraits][]", t));
    petData.photos.forEach(file => formData.append("photos", file));

    const response = await fetch(`${process.env.REACT_APP_API_URL}/pets`, {
      method: "POST",
      body: formData
    });
    if (response.ok) {
        alert("Pet listing created!");
        navigate(`/shelter/${curr_id}/listings`);
      } else {
        alert("Error creating listing");
      }
  };

  return (
    <PageLayout>
      <Box className="form-data-container">
        <Typography variant="h5" className="form-title">Create New Pet Listing</Typography>

        <TextField label="Name" value={petData.name} onChange={e => handleChange("name", e.target.value)} className="form-field" />
        <TextField label="Age" value={petData.age} onChange={e => handleChange("age", e.target.value)} className="form-field" />
        <TextField label="Gender" value={petData.gender} onChange={e => handleChange("gender", e.target.value)} className="form-field" />
        <TextField label="Size" value={petData.size} onChange={e => handleChange("size", e.target.value)} className="form-field" />
        <TextField label="Location" value={petData.location} onChange={e => handleChange("location", e.target.value)} className="form-field" />

        <Autocomplete multiple options={breedOptions} value={petData.breed}
          onChange={(e, newValue) => handleChange("breed", newValue)}
          renderTags={(selected, getTagProps) => selected.map((option, index) => <Chip key={option} label={option} {...getTagProps({index})} className="chip" />)}
          renderInput={(params) => <TextField {...params} label="Breed(s)" placeholder="Select breeds" className="form-field" />} />

        <TextField label="Summary" multiline rows={3} value={petData.summary} onChange={e => handleChange("summary", e.target.value)} className="form-field" />
        <TextField label="Routine" value={petData.routine} onChange={e => handleChange("routine", e.target.value)} className="form-field" />

        <Stack direction="row" spacing={2} className="form-stack">
          <TextField select label="Good With Children" value={petData.goodWithChildren ? "Yes" : "No"} onChange={e => handleChange("goodWithChildren", e.target.value==="Yes")} className="form-field-select">
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
          <TextField select label="Good With Dogs" value={petData.goodWithDogs ? "Yes" : "No"} onChange={e => handleChange("goodWithDogs", e.target.value==="Yes")} className="form-field-select">
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
          <TextField select label="Good With Cats" value={petData.goodWithCats ? "Yes" : "No"} onChange={e => handleChange("goodWithCats", e.target.value==="Yes")} className="form-field-select">
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Stack>

        <Typography variant="body1" className="section-title">Personality Traits</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {personalityOptions.map((trait, idx) => (
            <Chip key={idx} label={trait} color="primary" clickable variant={petData.traits.includes(trait) ? "filled" : "outlined"} onClick={() => handleTraitToggle(trait)} className="chip" />
          ))}
        </Stack>

        <div className="photo-upload">
          <Typography variant="body1">Upload Photos</Typography>
          <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="file-input"/>
        </div>

        {petData.previewUrls.length > 0 && (
          <Swiper modules={[Pagination, Navigation]} pagination={{ clickable: true }} navigation className="swiper-preview">
            {petData.previewUrls.map((photo, idx) => (
              <SwiperSlide key={idx}>
                <img src={photo} alt={`preview-${idx}`} className="preview-image" />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <Button className="submit-button" onClick={handleSubmit}>Create Listing</Button>
      </Box>
    </PageLayout>
  );
}

export default NewPetListingPage;
