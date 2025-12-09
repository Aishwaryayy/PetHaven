import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header/Header.js";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import PageLayout from "../PageLayout/PageLayout.js";
import "./UserProfilePage.css";

const API_BASE_URL = "https://pethaven-z4jb.onrender.com";

function UserProfilePage() {
  const { curr_id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  const token = localStorage.getItem("token");

  // Load current user details
  useEffect(() => {
    if (!token) {
      // if somehow user reached here without being logged in
      navigate("/login");
      return;
    }

    fetch(`${API_BASE_URL}/adopterUsers/${curr_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setFormData(data);
      })
      .catch((err) => {
        console.error("Failed to load user:", err);
      });
  }, [curr_id, token, navigate]);

  if (!user)
    return (
      <PageLayout>
        <Typography>Loading...</Typography>
      </PageLayout>
    );

  // Save profile edits
  const handleSave = () => {
    fetch(`${API_BASE_URL}/adopterUsers/${curr_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        setUser(formData);
        setEditMode(false);
      })
      .catch((err) => console.error("Failed to save user:", err));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // 🗑 DELETE ACCOUNT
  const handleDeleteAccount = () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    fetch(`${API_BASE_URL}/adopterUsers/${curr_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        // clear auth + send user to login/landing
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        navigate("/login");
      })
      .catch((err) => console.error("Failed to delete user:", err));
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

          {user.role === "shelter" && (
            <div>
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
              />

              <TextField
                label="Address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
              />
            </div>
          )}

          {user.role === "adopter" && (
            <TextField
              label="Location"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
            />
          )}

          {/* Edit / Save / Cancel row */}
          <div className="button-row">
            {!editMode ? (
              <Button
                variant="contained"
                className="edit-button"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <div>
                <Button
                  variant="contained"
                  className="save-button"
                  onClick={handleSave}
                >
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
              </div>
            )}
          </div>

          {/* NEW: Logout + Delete buttons */}
          <div className="button-row">
            <Button variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteAccount}
              style={{ marginLeft: "1rem" }}
            >
              Delete Account
            </Button>
          </div>
        </Stack>
      </Paper>
    </PageLayout>
  );
}

export default UserProfilePage;
