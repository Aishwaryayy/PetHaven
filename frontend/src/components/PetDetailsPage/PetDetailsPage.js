import React from "react";
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
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
import './PetDetailsPage.css';
import { GoDotFill } from "react-icons/go";
import { FaLocationDot } from "react-icons/fa6";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import {Swiper,SwiperSlide} from "swiper/react";
import {Pagination, Navigation} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
function PetDetailsPage(){
    const {curr_id} = useParams();
    const [currPet, setCurrPet] = useState("");
    useEffect(()=>{
        fetch(`http://localhost:4000/pets/${curr_id}`).then(res=>res.json()).then(data=>{
            setCurrPet(data);
            console.log("Pet data:");
            console.log(data);

        })


    },[]);
    if(!currPet){

        return (
            <PageLayout>
            <h1>Loading...</h1>

            </PageLayout>

        )
    }
    return(

        <PageLayout>
            <Stack direction="row" spacing={2}>
                <Swiper modules={[Pagination, Navigation]}
                  pagination={{ clickable: true }} navigation
                  className="swiper">
                  {currPet.photos.map((photo, idx) => (
                    <SwiperSlide key={idx}>
                      <img src={photo} alt={`${currPet.name}-${idx}`} />
                    </SwiperSlide>
                  ))} </Swiper>
                <Paper elevation={4} className="info-container">
                    <Typography variant="h6">Hello, I'm {currPet.name}!</Typography>
                    <Typography variant="body1">I am a {currPet.age}-year old {currPet.gender} {currPet.breed}. I'm from {currPet.location}. Thank you for checking out my profile! :)</Typography>
                    <Typography variant="body2"><strong>Summary: </strong>{currPet.profile.summary}</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                           <Typography variant="body2"><strong>Traits: </strong></Typography>
                          {currPet.profile.personalityTraits.map((trait,idx) =>(
                            <Chip key={idx} label={trait} className="chip-container" variant="outlined" />
                          ))}
                    </Stack>

                    <Typography variant="body2"><strong>Size:</strong> {currPet.size}</Typography>
                    <Typography variant="body2"><strong>Routine:</strong> {currPet.profile.routine}</Typography>
                    <Typography variant="body2"><strong>Good With Children:</strong>{currPet.profile.goodWithChildren ? "Yes":"No"}</Typography>
                    <Typography variant="body2"><strong>Good With Dogs:</strong>{currPet.profile.goodWithDogs ? "Yes":"No"}</Typography>
                    <Typography variant="body2"><strong>Good With Cats:</strong>{currPet.profile.goodWithCats ? "Yes":"No"}</Typography>
                    <Button className="adopt-button">ADOPT ME!</Button>

                </Paper>
            </Stack>
        </PageLayout>

    );




}
export default PetDetailsPage;