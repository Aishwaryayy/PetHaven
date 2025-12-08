import React from "react";
import {useState, useEffect} from "react";
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import { FaPaw } from "react-icons/fa6";
import './Header.css';
function Header(){

    return(

        <AppBar position="sticky" className="header-container">
        <div className="icon-container">
            <FaPaw />

            <Typography variant="h4">PawsHaven</Typography>
        </div>
        </AppBar>


    );




}
export default Header;