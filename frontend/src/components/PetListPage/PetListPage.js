import React from "react";
 import { useState, useEffect } from "react";
 import { Link, useLocation, useNavigate } from "react-router-dom";
 import PageLayout from "../PageLayout/PageLayout.js";
 import Box from "@mui/material/Box";
 import Grid from "@mui/material/Grid";
 import Card from "@mui/material/Card";
 import CardContent from "@mui/material/CardContent";
 import CardMedia from "@mui/material/CardMedia";
 import Typography from "@mui/material/Typography";
 import Stack from "@mui/material/Stack";
 import Chip from "@mui/material/Chip";
 import TextField from "@mui/material/TextField";
 import MenuItem from "@mui/material/MenuItem";
 import Button from "@mui/material/Button";
 import "./PetListPage.css";
 import { GoDotFill } from "react-icons/go";
 import { FaLocationDot } from "react-icons/fa6";

 function PetListPage() {
   const location = useLocation();
   const navigate = useNavigate();
   const [petList, setPetList] = useState([]);
   const [breed, setBreed] = useState("");
   const [age, setAge] = useState("");
   const [gender, setGender] = useState("");
   const [sortBy, setSortBy] = useState("");
   const preferences = location.state?.preferences || {};

   useEffect(() => {
     const fetchPets = async () => {
       try {
         const queryParams = new URLSearchParams();

         if (preferences.breed) {
           preferences.breed.forEach((b) => queryParams.append("breed", b));
         }
         if (preferences.ageRange) {
           queryParams.append("minAge", preferences.ageRange[0]);
           queryParams.append("maxAge", preferences.ageRange[1]);
         }
         if (preferences.gender) queryParams.append("gender", preferences.gender);
         if (preferences.size) queryParams.append("size", preferences.size);
         if (preferences.location)
           queryParams.append("location", preferences.location);
         if (preferences.traits) {
           preferences.traits.forEach((t) => queryParams.append("traits", t));
         }

         const res = await fetch(
           `${process.env.REACT_APP_API_URL}/pets?${queryParams.toString()}`,
           { method: "GET" }
         );

         const data = await res.json();
         setPetList(data);
       } catch (err) {
         console.error("Error fetching pets:", err);
       }
     };

     fetchPets();
   }, [preferences]);

   const filteredPets = petList
     .filter((pet) => {
       const matchesBreed =
         breed === "" ||
         pet.breed.toLowerCase().includes(breed.toLowerCase());
       const matchesAge = age === "" || pet.age.toString() === age;
       const matchesGender = gender === "" || pet.gender === gender;
       return matchesBreed && matchesAge && matchesGender;
     })
     .sort((a, b) => {
       if (sortBy === "name") return a.name.localeCompare(b.name);
       if (sortBy === "age-low") return a.age - b.age;
       if (sortBy === "age-high") return b.age - a.age;
       if (sortBy === "location") return a.location.localeCompare(b.location);
       return 0;
     });

   const isAdopter = localStorage.getItem("userRole") === "adopter";
   const userId = localStorage.getItem("userId");

   return (
     <PageLayout>
       <Stack direction="row" className="listing-container">
         <Stack spacing={3} className="left-container">
           <Box className="filter-box-container">
             <Typography variant="h5" fontWeight="bold">
               Filters
             </Typography>

             <TextField
               label="Breed"
               fullWidth
               value={breed}
               onChange={(e) => setBreed(e.target.value)}
             />

             <TextField
               label="Age"
               fullWidth
               value={age}
               onChange={(e) => setAge(e.target.value)}
             />

             <TextField
               select
               label="Gender"
               fullWidth
               value={gender}
               onChange={(e) => setGender(e.target.value)}
             >
               <MenuItem value="">All</MenuItem>
               <MenuItem value="Male">Male</MenuItem>
               <MenuItem value="Female">Female</MenuItem>
             </TextField>
           </Box>
         </Stack>

         <Box className="right-container">
           <Box
             className="petlist-header"
           >
             <Stack direction="row" spacing={2} alignItems="center">
               <Typography variant="h5">Pet Listings</Typography>
               <TextField
                 select
                 size="small"
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value)}
                 className="sort-select"
                 label="Sort By"
               >
                 <MenuItem value="">None</MenuItem>
                 <MenuItem value="name">Name (A–Z)</MenuItem>
                 <MenuItem value="age-low">Age (Low–High)</MenuItem>
                 <MenuItem value="age-high">Age (High–Low)</MenuItem>
                 <MenuItem value="location">Location (A–Z)</MenuItem>
               </TextField>
             </Stack>

             {isAdopter && (
               <Stack direction="row" spacing={2}>
                 <Button
                   variant="contained"
                   color="primary"
                   onClick={() => navigate(`/users/${userId}`)}
                 >
                   My Profile
                 </Button>
                 <Button
                   variant="outlined"
                   color="primary"
                   onClick={() => navigate("/applications")}
                 >
                   View My Applications
                 </Button>
               </Stack>
             )}
           </Box>

           {filteredPets.length === 0 ? (
             <Typography variant="h6">
               No pets matching your preferences!
             </Typography>
           ) : (
             <Grid container spacing={3} alignItems="stretch">
               {filteredPets.map((pet) => (
                 <Grid item xs={12} sm={6} md={4} key={pet._id}>
                   <Link to={`/listings/${pet._id}`} className="details-link">
                     <Card className="card-container">
                       <CardMedia
                         component="img"
                         height="180"
                         image={pet.photos[0]}
                         alt={pet.name}
                         className="card-media"
                       />

                       <CardContent>
                         <Stack direction="column" spacing={2}>
                           <Typography variant="h5" fontWeight="bold">
                             {pet.name}
                           </Typography>

                           <Typography variant="body2" color="text.secondary">
                             {pet.breed} <GoDotFill /> {pet.age} yrs{" "}
                             <GoDotFill /> {pet.gender}
                           </Typography>

                           <Typography variant="body2" color="text.secondary">
                             <FaLocationDot /> {pet.location}
                           </Typography>

                           <Stack direction="row" spacing={1}>
                             <Chip
                               label={pet.availability}
                               color={
                                 pet.availability === "available"
                                   ? "success"
                                   : "default"
                               }
                               size="small"
                             />
                           </Stack>
                         </Stack>
                       </CardContent>
                     </Card>
                   </Link>
                 </Grid>
               ))}
             </Grid>
           )}
         </Box>
       </Stack>
     </PageLayout>
   );
 }

 export default PetListPage;
