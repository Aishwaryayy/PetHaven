import React from "react";
import {useState, useEffect} from "react";
import Header from '../Header/Header.js';
import PageLayout from '../PageLayout/PageLayout.js';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import './PetListPage.css';
import { GoDotFill } from "react-icons/go";
import { FaLocationDot } from "react-icons/fa6";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";


function PetListPage(){
    const [petList, setPetList] = useState([]);
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    useEffect(()=>{
        fetch("http://localhost:4000/pets").then(res=>res.json()).then(data=>{
            setPetList(data);
            console.log("Pet list:");
            console.log(data);

        })



    },[]);
    const filteredPets = petList.filter((pet) => {
      const matchesBreed =breed === "" || pet.breed.toLowerCase().includes(breed.toLowerCase());
      const matchesAge = age === "" || pet.age.toString() === age;

      const matchesGender = gender === "" || pet.gender === gender;
      return matchesBreed && matchesAge && matchesGender;
    });

    return(

        <PageLayout>
             <Stack direction="row" className="listing-container">
                <Stack spacing={3} className="left-container">
                <Box className="filter-box-container">
            <Typography variant="h6" fontWeight="bold">
              Filters
            </Typography>

                  <TextField label="Breed" fullWidth value={breed} onChange={(e) => setBreed(e.target.value)}/>


                  <TextField label="Age" fullWidth value={age} onChange={(e) => setAge(e.target.value)} />


                  <TextField select label="Gender" fullWidth
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}>
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </TextField>


                </Box>
                </Stack>
                <Box className="right-container">
                <Grid container spacing={3} alignItems="stretch">
                   {filteredPets.map((pet) => (
                     <Grid item xs={12} sm={6} md={4} key={pet.id} style={{ display: 'flex' }}>
                       <Card className="card-container">
                         <CardMedia component="img" height="180" image={pet.thumbnail} alt={pet.name}
                           className="card-media"/>

                         <CardContent>
                           <Stack direction="column" spacing={2}>
                           <Typography variant="h6" fontWeight="bold"> {pet.name} </Typography>

                           <Typography variant="body2" color="text.secondary">
                             {pet.breed} <GoDotFill/> {pet.age} yrs <GoDotFill/> {pet.gender}
                           </Typography>

                           <Typography variant="body2" color="text.secondary">
                           <FaLocationDot />
                             {pet.location} </Typography>


                           <Stack direction="row" spacing={1} >
                             <Chip label={pet.availability} color={pet.availability === "available" ? "success" : "default"}
                               size="small" />

                           </Stack>
                           </Stack>
                         </CardContent>
                       </Card>
                     </Grid>
                   ))}
                   </Grid>
                   </Box>
                 </Stack>
        </PageLayout>

    );




}
export default PetListPage;