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
import './AdoptionApplicationsPage.css';
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
import {useParams} from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function AdoptionApplicationsPage() {
    const {curr_id} = useParams();
    //console.log(curr_id);
   const [applications, setApplications] = useState([]);

   const [filter, setFilter] = useState("all");

   useEffect(()=>{
       fetch(`http://localhost:4000/applications?petId=${curr_id}`).then(res=>res.json()).then(data=>{
           setApplications(data);
           console.log("Application list:");
           console.log(data);

       })
   },[]);




  return (
   <PageLayout>
        <Typography variant="h5">Adoption Applications for Pet {curr_id}</Typography>
        <Stack spacing={3}>

        {applications.map((app)=>{
            return(
            <Accordion>
               <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography variant="body1">Application {app.id}</Typography>

               </AccordionSummary>
               <AccordionDetails className="details-container">

                    <Typography variant="body2">Date Applied: {app.dateApplied}</Typography>
                    <Typography variant="body2">Adopter ID: {app.userId}</Typography>
                     <Chip label={app.status} color="primary"></Chip>
                     <div>
                     <Button color="primary" className="view-button">View Adopter Profile</Button>
                      <Button color="primary" className="issue-button">Issue a decision</Button>
                      </div>
               </AccordionDetails>
            </Accordion>
            );


        })}

        </Stack>
    </PageLayout>
  );
}

export default AdoptionApplicationsPage;
