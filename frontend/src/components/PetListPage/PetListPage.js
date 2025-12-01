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

function PetListPage(){
    const [petList, setPetList] = useState([]);
    useEffect(()=>{
        fetch("http://localhost:4000/pets").then(res=>res.json()).then(data=>{
            setPetList(data);
            console.log("Pet list:");
            console.log(data);

        })



    },[]);
    return(

        <PageLayout>
             <Grid container spacing={3}>
                   {petList.map((pet) => (
                     <Grid item xs={12} key={pet.id}>
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
        </PageLayout>

    );




}
export default PetListPage;