import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./ShelterEditListingPage.css";

function ShelterEditListingPage() {
  const { curr_id, petId } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/pets/${petId}`)
      .then((res) => res.json())
      .then((data) => {
        setPetData({
          name: data.name,
          age: data.age,
          gender: data.gender,
          size: data.size,
          location: data.location,
          breed: Array.isArray(data.breed) ? data.breed : [data.breed],
          photos: [],
          previewUrls: data.photos || [],
          summary: data.profile.summary,
          routine: data.profile.routine,
          goodWithChildren: data.profile.goodWithChildren,
          goodWithDogs: data.profile.goodWithDogs,
          goodWithCats: data.profile.goodWithCats,
          traits: data.profile.personalityTraits || []
        });
      })
      .catch((err) => console.error("Error fetching pet for editing:", err));
  }, [petId]);

  const handleChange = (field, value) => {
    setPetData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTraitToggle = (trait) => {
    setPetData((prev) => ({
      ...prev,
      traits: prev.traits.includes(trait)
        ? prev.traits.filter((t) => t !== trait)
        : [...prev.traits, trait],
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPetData((prev) => ({
      ...prev,
      photos: files,
      previewUrls: [...prev.previewUrls, ...urls],
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("name", petData.name);
    formData.append("age", petData.age);
    formData.append("gender", petData.gender);
    formData.append("size", petData.size);
    formData.append("location", petData.location);

    petData.breed.forEach((b) => formData.append("breed[]", b));

    formData.append("profile[summary]", petData.summary);
    formData.append("profile[routine]", petData.routine);
    formData.append("profile[goodWithChildren]", petData.goodWithChildren);
    formData.append("profile[goodWithDogs]", petData.goodWithDogs);
    formData.append("profile[goodWithCats]", petData.goodWithCats);

    petData.traits.forEach((t) =>
      formData.append("profile[personalityTraits][]", t)
    );

    petData.photos.forEach((file) => formData.append("photos", file));

    await fetch(`${process.env.REACT_APP_API_URL}/pets/${petId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: formData
    });

    alert("Listing updated!");
    navigate(`/shelter/${curr_id}/listings`);
  };

  return (
    <PageLayout>
      <Box className="form-data-container">
        <Typography variant="h5" className="form-title">
          Edit Pet Listing
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Name"
            value={petData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="form-field"
          />

          <TextField
            label="Age"
            value={petData.age}
            onChange={(e) => handleChange("age", e.target.value)}
            className="form-field"
          />

          <TextField
            label="Gender"
            value={petData.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            className="form-field"
          />

          <TextField
            label="Size"
            value={petData.size}
            onChange={(e) => handleChange("size", e.target.value)}
            className="form-field"
          />

          <TextField
            label="Location"
            value={petData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="form-field"
          />

          <Autocomplete
            multiple
            options={breedOptions}
            value={petData.breed}
            onChange={(e, newValue) => handleChange("breed", newValue)}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip key={option} label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Breed(s)" className="form-field" />
            )}
          />

          <TextField
            label="Summary"
            multiline
            rows={3}
            value={petData.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            className="form-field"
          />

          <TextField
            label="Routine"
            value={petData.routine}
            onChange={(e) => handleChange("routine", e.target.value)}
            className="form-field"
          />

          <Stack direction="row" spacing={2} className="form-stack">
            <TextField
              select
              label="Good With Children"
              value={petData.goodWithChildren ? "Yes" : "No"}
              onChange={(e) =>
                handleChange("goodWithChildren", e.target.value === "Yes")
              }
              className="form-field-select"
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>

            <TextField
              select
              label="Good With Dogs"
              value={petData.goodWithDogs ? "Yes" : "No"}
              onChange={(e) =>
                handleChange("goodWithDogs", e.target.value === "Yes")
              }
              className="form-field-select"
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>

            <TextField
              select
              label="Good With Cats"
              value={petData.goodWithCats ? "Yes" : "No"}
              onChange={(e) =>
                handleChange("goodWithCats", e.target.value === "Yes")
              }
              className="form-field-select"
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
          </Stack>

          <Typography variant="body1" className="section-title">
            Personality Traits
          </Typography>

          <Stack direction="row" flexWrap="wrap">
            {personalityOptions.map((trait, idx) => (
              <Chip
                key={idx}
                label={trait}
                clickable
                color="primary"
                variant={petData.traits.includes(trait) ? "filled" : "outlined"}
                onClick={() => handleTraitToggle(trait)}
                className="chip"
              />
            ))}
          </Stack>

          <div className="photo-upload">
            <Typography variant="body1">Upload Additional Photos</Typography>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="file-input"
            />
          </div>

          {petData.previewUrls.length > 0 && (
            <Swiper
              modules={[Pagination, Navigation]}
              pagination={{ clickable: true }}
              navigation
              className="swiper-preview"
            >
              {petData.previewUrls.map((photo, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={photo}
                    alt={`preview-${idx}`}
                    className="preview-image"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <Button className="submit-button" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Stack>
      </Box>
    </PageLayout>
  );
}

export default ShelterEditListingPage;
