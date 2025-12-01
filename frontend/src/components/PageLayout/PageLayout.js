import React from "react";
import {useState, useEffect} from "react";
import Header from '../Header/Header.js';
import './PageLayout.css';
function PageLayout({children}){

    return(
        <div className="page-container">
            <div className="page-header">
            <Header></Header>
            </div>
            <div className="page-content">
            <div className="page-content-container">
            {children}
            </div>
            </div>
        </div>
    );




}
export default PageLayout;