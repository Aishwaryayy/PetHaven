import React,{useState,useEffect} from "react";
import {Link,useParams,useNavigate} from "react-router-dom";
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
import './ShelterListingsPage.css';
import { GoDotFill } from "react-icons/go";
import { FaLocationDot } from "react-icons/fa6";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
function ShelterListingsPage(){
    const {curr_id} = useParams();
    const navigate = useNavigate();
    const [petList, setPetList] = useState([]);
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}/pets/shelter/${curr_id}`)
          .then(res=>res.json())
          .then(data=>{
            setPetList(data);
            console.log("Pet list:",data);
          })
          .catch(err => console.error(err));
    },[curr_id]);

    const filteredPets = petList.filter((pet) => {
      const matchesBreed = breed === "" || pet.breed.toLowerCase().includes(breed.toLowerCase());
      const matchesAge = age === "" || pet.age.toString() === age;
      const matchesGender = gender === "" || pet.gender === gender;
      return matchesBreed && matchesAge && matchesGender;
    });
    const handleDelete = async (id) => {
      if (!window.confirm("Are you sure you want to delete this listing?")) return;

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/pets/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
              setPetList(prev => prev.filter(p => p._id !== id));
              alert("Pet listing deleted successfully!");
            }
        else {
              alert("Failed to delete listing");
            }
          } catch (err) {
            console.error("Delete failed:", err);
            alert("Error deleting listing");
          }

        setPetList(prev => prev.filter(p => p.id !== id));

    };

    return(
        <PageLayout>
             <Stack direction="row" className="listing-container">
                <Stack spacing={3} className="left-container">
                <Box className="filter-box-container">
                    <Typography variant="h5" fontWeight="bold">
                      Filters
                    </Typography>

                    <TextField label="Breed" fullWidth value={breed} onChange={(e) => setBreed(e.target.value)}/>
                    <TextField label="Age" fullWidth value={age} onChange={(e) => setAge(e.target.value)} />

                    <TextField select label="Gender" value={gender}
                        onChange={(e) => setGender(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                    </TextField>
                </Box>
                </Stack>

                <Box className="right-container">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h5">My Pets</Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/shelter/${curr_id}/add_listings`)}>
                      Add New Listing
                    </Button>

                  </Stack>
                </Box>
                {filteredPets.length===0 ? (
                  <Typography variant="body1">No Pets Added</Typography>
                ) : (
                  <Grid container spacing={3} alignItems="stretch">
                     {filteredPets.map((pet) => (
                       <Grid item xs={12} sm={6} md={4} key={pet.id} >
                       <Link to={`/listings/${pet._id}`} className="details-link">
                         <Card className="card-container">
                           <CardMedia component="img" height="180" image={pet.photos[0]} alt={pet.name} className="card-media"/>
                           <CardContent>
                             <Stack direction="column" spacing={2}>
                               <Typography variant="h5" fontWeight="bold"> {pet.name} </Typography>
                               <Typography variant="body2" color="text.secondary">
                                 {pet.breed} <GoDotFill/> {pet.age} yrs <GoDotFill/> {pet.gender}
                               </Typography>
                               <Typography variant="body2" color="text.secondary">
                                 <FaLocationDot /> {pet.location}
                               </Typography>
                               <Stack direction="row" spacing={1} >
                                 <Chip label={pet.availability} color={pet.availability === "available" ? "success" : "default"} size="small" />
                                   <Button
                                      variant="outlined"
                                      size="small"
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          navigate(`/applications/${pet._id}`)}}
                                       color="primary">
                                      View Applications
                                    </Button>
                                    <Stack direction="row" spacing={1}>
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          navigate(`/shelter/${curr_id}/edit/${pet._id}`);
                                        }}
                                      >
                                        Edit
                                      </Button>

                                      <Button
                                        variant="outlined"
                                        size="small"
                                        color="error"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleDelete(pet._id);
                                        }}
                                      >
                                        Delete
                                      </Button>
                                    </Stack>
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

export default ShelterListingsPage;
