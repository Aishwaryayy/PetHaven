import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import PetDetailsPage from './components/PetDetailsPage.js';
import PetListPage from './components/PetListPage/PetListPage.js';
import Typography from '@mui/material/Typography';
function App() {
  return (
    <Router>
    <Routes>
        <Route path="/listings" element={<PetListPage />}  />

    </Routes>
    </Router>
  );
}

export default App;
