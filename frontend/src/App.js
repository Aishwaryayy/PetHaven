import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import PetDetailsPage from './components/PetDetailsPage.js';
import PetListPage from './components/PetListPage/PetListPage.js';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"Satisfy", cursive',

    body2: {
      fontFamily:  '"Roboto Mono", monospace',
      fontWeight:200,
    },
    h6: {
          fontFamily:  '"Roboto Mono", monospace',
          fontWeight:200,
    },
  },

});

function App() {
  return (
    <ThemeProvider theme={theme}>
    <Router>
    <Routes>
        <Route path="/listings" element={<PetListPage />}  />

    </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
