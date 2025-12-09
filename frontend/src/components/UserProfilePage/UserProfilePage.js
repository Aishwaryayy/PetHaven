import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import PageLayout from "../PageLayout/PageLayout.js";
import "./UserProfilePage.css";

function UserProfilePage() {
  const { curr_id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  const viewerRole = localStorage.getItem("userRole");
  const viewerId = localStorage.getItem("userId");
  const canEdit = viewerRole === "adopter" && viewerId === curr_id;

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const endpoint = `${process.env.REACT_APP_API_URL}/adopterUsers/${curr_id}`;

      try {
        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setUser(data);
        setFormData(data);
      } catch {
        alert("Error loading profile");
      }
    };

    fetchUserData();
  }, [curr_id, navigate]);

  if (!user)
    return (
      <PageLayout>
        <Typography>Loading...</Typography>
      </PageLayout>
    );

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const endpoint = `${process.env.REACT_APP_API_URL}/adopterUsers/${curr_id}`;

    const res = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) return;

    const updated = await res.json();
    const updatedUser = updated.user || updated;

    setUser(updatedUser);
    setFormData(updatedUser);
    setEditMode(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/adopterUsers/${curr_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      alert("Failed to delete account");
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");

    navigate("/login");
  };

  return (
    <PageLayout>
      <Paper className="profile-container">
        <Typography variant="h5" className="profile-title">
          User Profile – {user.name}
        </Typography>

        <Stack spacing={3} className="profile-stack">
          <TextField
            label="Name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />

          <TextField
            label="Email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />

          <TextField
            label="Location"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />

          {canEdit && !editMode && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                className="edit-button"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
              >
                Delete Account
              </Button>
            </Stack>
          )}

          {canEdit && editMode && (
            <Stack direction="row" spacing={2}>
              <Button variant="contained" className="save-button" onClick={handleSave}>
                Save
              </Button>

              <Button
                variant="outlined"
                className="cancel-button"
                onClick={() => {
                  setFormData(user);
                  setEditMode(false);
                }}
              >
                Cancel
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
              >
                Delete Account
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>
    </PageLayout>
  );
}

export default UserProfilePage;

