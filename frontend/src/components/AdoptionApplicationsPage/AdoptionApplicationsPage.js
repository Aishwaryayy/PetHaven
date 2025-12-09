import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout.js";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "./AdoptionApplicationsPage.css";

function AdoptionApplicationsPage() {
   const { curr_id } = useParams();
   const navigate = useNavigate();

   const [applications, setApplications] = useState([]);
   const [pet, setPet] = useState(null);

   const [openDialog, setOpenDialog] = useState(false);
   const [selectedApp, setSelectedApp] = useState(null);
   const [newStatus, setNewStatus] = useState("approved");

   useEffect(() => {
     fetch(`${process.env.REACT_APP_API_URL}/applications/pet/${curr_id}`)
       .then((res) => res.json())
       .then((data) => {
         setApplications(data);
       })
       .catch((err) => console.error(err));
   }, [curr_id]);

   useEffect(() => {
     fetch(`${process.env.REACT_APP_API_URL}/pets/${curr_id}`)
       .then((res) => res.json())
       .then((data) => {
         setPet(data);
       })
       .catch((err) => console.error(err));
   }, [curr_id]);

   const handleOpenDialog = (app) => {
     setSelectedApp(app);
     setNewStatus("approved");
     setOpenDialog(true);
   };

   const handleCloseDialog = () => {
     setOpenDialog(false);
     setSelectedApp(null);
   };

   const handleStatusUpdate = async (applicationId, status, petId) => {
     try {
       const res = await fetch(
         `${process.env.REACT_APP_API_URL}/applications/${applicationId}`,
         {
           method: "PUT",
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${localStorage.getItem("token")}`,
           },
           body: JSON.stringify({ status }),
         }
       );

       if (!res.ok) {
         alert("Failed to update application status");
         return;
       }

       if (status === "approved") {
         const petRes = await fetch(
           `${process.env.REACT_APP_API_URL}/pets/${petId}`,
           {
             method: "PUT",
             headers: {
               "Content-Type": "application/json",
             },
             body: JSON.stringify({ availability: "adopted" }),
           }
         );

         if (petRes.ok) {
           alert("Application approved and pet marked as adopted!");
         }
       } else {
         alert("Application status updated!");
       }

       setApplications((prev) =>
         prev.map((app) =>
           app._id === applicationId ? { ...app, status } : app
         )
       );
     } catch (err) {
       console.error("Error updating status:", err);
       alert("Error connecting to server");
     }
   };

   return (
     <PageLayout>
       <Typography variant="h5">
         Adoption Applications for{" "}
         {pet ? pet.name : `Pet ${curr_id}`}
       </Typography>

      <Stack spacing={3} mt={2}>
        {applications.length === 0 ? (
          <Typography variant="body1">No applications yet.</Typography>
        ) : (
          applications.map((app) => (
            <Accordion className="accordion-container" key={app._id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className="app-accordion-summary"
              >
                <div className="accordion-header">
                  <Typography variant="body1" className="accordion-title">
                    Application {app._id}
                  </Typography>
                  <Chip
                    label={app.status}
                    color="primary"
                    size="small"
                    className={`status-chip status-${app.status.toLowerCase()}`}
                  />
                </div>
              </AccordionSummary>

              <AccordionDetails className="details-container">
                <div className="details-info">
                  <Typography variant="body2">
                    <strong>Date Applied:</strong> {app.createdAt}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Adopter ID:</strong> {app.userId}
                  </Typography>
                </div>

                <div className="buttons-row">
                  <Button
                    color="primary"
                    className="view-button"
                    onClick={() => navigate(`/users/${app.userId}`)}
                  >
                    View Adopter Profile
                  </Button>

                  <Button
                    color="primary"
                    className="issue-button"
                    disabled={app.status.toLowerCase() !== "pending"}
                    onClick={() => handleOpenDialog(app)}
                  >
                    Issue a decision
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Stack>


       <Dialog open={openDialog} onClose={handleCloseDialog}>
         <DialogTitle>Update Application Status</DialogTitle>
         <DialogContent>
           <Select
             value={newStatus}
             onChange={(e) => setNewStatus(e.target.value)}
             fullWidth
           >
             <MenuItem value="approved">Approved</MenuItem>
             <MenuItem value="rejected">Rejected</MenuItem>
           </Select>
         </DialogContent>
         <DialogActions>
           <Button onClick={handleCloseDialog}>Cancel</Button>
           <Button
             variant="contained"
             color="primary"
             onClick={() => {
               if (!selectedApp) return;
               handleStatusUpdate(selectedApp._id, newStatus, selectedApp.petId || curr_id);
               handleCloseDialog();
             }}
           >
             Submit
           </Button>
         </DialogActions>
       </Dialog>
     </PageLayout>
   );
 }

export default AdoptionApplicationsPage;
