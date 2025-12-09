import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import PetDetailsPage from './components/PetDetailsPage/PetDetailsPage.js';
import PetListPage from './components/PetListPage/PetListPage.js';
import UserPreferencePage from './components/UserPreferencePage/UserPreferencePage.js';
import AdoptionApplicationsPage from './components/AdoptionApplicationsPage/AdoptionApplicationsPage.js';
import UserProfilePage from './components/UserProfilePage/UserProfilePage.js';
import NewPetListingPage from './components/NewPetListingPage/NewPetListingPage.js';
import UserLoginPage from './components/UserLoginPage/UserLoginPage.js';
import ShelterListingsPage from './components/ShelterListingsPage/ShelterListingsPage.js';
import MyApplicationsPage from './components/MyApplicationsPage/MyApplicationsPage.js';
import ShelterEditListingPage from './components/ShelterEditListingPage/ShelterEditListingPage.js';
import Typography from '@mui/material/Typography';
import {Navigate} from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
    palette: {
           primary: {
             main: "#271C45",
           }},
  typography: {
    fontFamily: '"Satisfy", cursive',

    body2: {
      fontFamily:  '"Roboto Mono", monospace',
      fontWeight:300,
    },
    body1: {
          fontFamily:  '"Roboto Mono", monospace',
          fontWeight:400,
    },
    h5: {
          fontFamily:  '"Roboto Mono", monospace',
          fontWeight:500,
    },
  },

});

function App() {
  return (
    <ThemeProvider theme={theme}>
    <Router>
    <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/listings" element={<PetListPage />}  />
        <Route path="/listings/:curr_id" element={<PetDetailsPage />}  />
        <Route path="/preferences" element={<UserPreferencePage />}  />
        <Route path="/applications/:curr_id" element={<AdoptionApplicationsPage />}  />
        <Route path="/users/:curr_id" element={<UserProfilePage />}  />
        <Route path="/shelter/:curr_id/add_listings" element={<NewPetListingPage/>} />
        <Route path="/shelter/:curr_id/listings" element={<ShelterListingsPage/>} />
        <Route path="/shelter/:curr_id/edit/:petId" element={<ShelterEditListingPage />} />
        <Route path="/applications" element={<MyApplicationsPage />} />
        <Route path="/login" element={<UserLoginPage/>}/>
    </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
