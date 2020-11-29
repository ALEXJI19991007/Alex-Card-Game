/* Copyright G. Hemingway, @2020 - All rights reserved */
"use strict";

import React from "react";
import {containerHeaderStyle, Footer, FooterP, titlePart} from "./styles";

export const Landing = () => (
    <div style={{backgroundColor: "#434343"}}>
        <div className="container-fluid">
            <header style={containerHeaderStyle}>
                <p id="title-part" style={titlePart}>
                    <span style={{color: "#FBAF41"}}>Welcome To</span>
                    <br/> AlexCard
                </p>
            </header>
        </div>
        <Footer>
            <FooterP style={{fontSize: "1.2em", padding: "10px"}}>What We Do</FooterP>
            <FooterP>"Help You Find The Best Card Game Experience."</FooterP>
            <FooterP>YU JI, TN</FooterP>
            <FooterP>yu.ji@vanderbilt.edu</FooterP>
            <FooterP>+1 615-415-5656</FooterP>
        </Footer>
    </div>
);
