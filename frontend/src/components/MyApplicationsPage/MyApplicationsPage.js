import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout.js";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import "./MyApplicationsPage.css";

function MyApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/applications/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch applications", res.status);
          return;
        }

        const data = await res.json();

        const appsWithPets = await Promise.all(
          data.map(async (app) => {

            if (app.petId && typeof app.petId === "object") {
              return { ...app, pet: app.petId };
            }


            if (app.petId && typeof app.petId === "string") {
              try {
                const petRes = await fetch(
                  `${process.env.REACT_APP_API_URL}/pets/${app.petId}`
                );
                if (petRes.ok) {
                  const pet = await petRes.json();
                  return { ...app, pet };
                }
              } catch (e) {
                console.error("Error fetching pet for application", app._id, e);
              }
            }

            return { ...app, pet: null };
          })
        );

        setApplications(appsWithPets);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <PageLayout>
      <Typography variant="h5">My Adoption Applications</Typography>

      <Stack spacing={3} mt={2}>
        {applications.length === 0 ? (
          <Typography variant="body1">
            You have not submitted any applications yet.
          </Typography>
        ) : (
          applications.map((app) => {
            const pet = app.pet;

            return (
              <Accordion className="accordion-container" key={app._id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className="app-accordion-summary"
                >
                  <div className="accordion-header">
                    <Typography variant="body1" className="accordion-title">
                      {pet && pet.name
                        ? `Application for ${pet.name}`
                        : `Application ${app._id}`}
                    </Typography>
                    <Chip
                      label={app.status}
                      color={
                        app.status.toLowerCase() === "approved"
                          ? "success"
                          : app.status.toLowerCase() === "rejected"
                          ? "error"
                          : "primary"
                      }
                      size="small"
                    />
                  </div>
                </AccordionSummary>

                <AccordionDetails className="details-container">
                  <Typography variant="body2">
                    <strong>Status:</strong> {app.status}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Date Applied:</strong> {app.createdAt}
                  </Typography>

                  {pet && (
                    <>
                      <Typography variant="body2">
                        <strong>Pet:</strong> {pet.name}
                        {pet.breed ? ` (${pet.breed})` : ""}
                      </Typography>
                      {pet.location && (
                        <Typography variant="body2">
                          <strong>Location:</strong> {pet.location}
                        </Typography>
                      )}
                      <Button
                        sx={{ mt: 1 }}
                        size="small"
                        onClick={() => navigate(`/listings/${pet._id}`)}
                      >
                        View Pet Profile
                      </Button>
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })
        )}
      </Stack>
    </PageLayout>
  );
}

export default MyApplicationsPage;
