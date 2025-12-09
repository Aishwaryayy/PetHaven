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
  const { curr_id } = useParams(); // still there if route uses it
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // Try both keys just in case your app used different ones
  const storedUserId =
    localStorage.getItem("userId") || localStorage.getItem("userID");
  const storedRole =
    localStorage.getItem("userRole") || localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // Load user profile
  useEffect(() => {
    const fetchUserData = async () => {
      if (!storedUserId || !token) {
        alert("Please login first!");
        navigate("/login");
        return;
      }

      const endpoint =
        storedRole === "shelter"
          ? `${API_BASE_URL}/shelterUsers/${storedUserId}`
          : `${API_BASE_URL}/adopterUsers/${storedUserId}`;

      try {
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await res.json();
        setUser(data);
        setFormData(data);
      } catch (err) {
        console.error("Error fetching user:", err);
        alert("Error loading profile");
      }
    };

    fetchUserData();
  }, [storedUserId, storedRole, token, navigate]);

  if (!user)
    return (
      <PageLayout>
        <Typography>Loading...</Typography>
      </PageLayout>
    );

  // Save edits
  const handleSave = async () => {
    if (!storedUserId || !token) return;

    const endpoint =
      storedRole === "shelter"
        ? `${API_BASE_URL}/shelterUsers/${storedUserId}`
        : `${API_BASE_URL}/adopterUsers/${storedUserId}`;

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to save user");
      }

      setUser(formData);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to save user:", err);
      alert("Error saving profile");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🚪 Logout button
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userID");
    localStorage.removeItem("role");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  // 🗑 Delete account button
  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    if (!storedUserId || !token) return;

    const endpoint =
      storedRole === "shelter"
        ? `${API_BASE_URL}/shelterUsers/${storedUserId}`
        : `${API_BASE_URL}/adopterUsers/${storedUserId}`;

    try {
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      // Clear auth & redirect
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userID");
      localStorage.removeItem("role");
      localStorage.removeItem("userRole");
      navigate("/login");
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Error deleting account");
    }
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
