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
import './UserProfilePage.css';
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

function UserProfilePage() {
    const {curr_id} = useParams();

    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/users/${curr_id}`)
          .then((res) => res.json())
          .then((data) => {
            setUser(data);
            setFormData(data);
          });
      }, [curr_id]);

    if (!user) return <PageLayout><Typography>Loading...</Typography></PageLayout>;

    const handleSave = () => {
        fetch(`http://localhost:4000/users/${curr_id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }).then(() => {
          setUser(formData);
          setEditMode(false);
        });
      };

    const handleChange = (e) => {
        //console.log(e);
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      };




  return (
   <PageLayout>
         <Paper className="profile-container">
                <Typography variant="h5" className="profile-title">User Profile – {user.name}</Typography>
                <Stack spacing={3} className="profile-stack">
                  <TextField label="Name" name="name" value={formData.name || ""} onChange={handleChange} fullWidth disabled={!editMode}/>

                  <TextField label="Email" name="email" value={formData.email || ""} onChange={handleChange} fullWidth disabled={!editMode}/>
                  {user.role === "shelter" && (
                    <div>
                      <TextField label="Phone" name="phone" value={formData.phone || ""} onChange={handleChange} fullWidth disabled={!editMode}/>

                      <TextField label="Address" name="address" value={formData.address || ""} onChange={handleChange} fullWidth disabled={!editMode}/>
                    </div>
                  )}

                  {user.role === "adopter" && (
                    <TextField label="Location" name="location" value={formData.location || ""} onChange={handleChange} fullWidth disabled={!editMode}/>
                  )}

                  <div className="button-row">
                    {!editMode ? (
                      <Button variant="contained" className="edit-button" onClick={() => setEditMode(true)}>Edit Profile</Button>
                    ):(
                      <div>
                        <Button variant="contained" className="save-button" onClick={handleSave}>Save</Button>

                        <Button variant="outlined" className="cancel-button"
                          onClick={() => {
                            setFormData(user);
                            setEditMode(false);
                          }}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                </Stack>
              </Paper>

    </PageLayout>
  );
}

export default UserProfilePage;
