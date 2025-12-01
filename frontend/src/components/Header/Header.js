import React from "react";
import {useState, useEffect} from "react";
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import './Header.css';
function Header(){

    return(

        <AppBar position="sticky" className="header-container">
            <Typography variant="h4">PawsHaven</Typography>

        </AppBar>


    );




}
export default Header;