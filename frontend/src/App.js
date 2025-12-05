import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import PetDetailsPage from './components/PetDetailsPage/PetDetailsPage.js';
import PetListPage from './components/PetListPage/PetListPage.js';
import UserPreferencePage from './components/UserPreferencePage/UserPreferencePage.js';
import AdoptionApplicationsPage from './components/AdoptionApplicationsPage/AdoptionApplicationsPage.js';
import Typography from '@mui/material/Typography';
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
        <Route path="/listings" element={<PetListPage />}  />
        <Route path="/listings/:curr_id" element={<PetDetailsPage />}  />
        <Route path="/preferences" element={<UserPreferencePage />}  />
        <Route path="/applications/:curr_id" element={<AdoptionApplicationsPage />}  />
    </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
