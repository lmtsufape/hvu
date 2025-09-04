import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03 } from "@/components/Lapa/Header";
import { SubHeaderGeral } from "@/components/Lapa/SubHeader"; 
import TipoTutor from "@/components/Lapa/TipoTutor";
import Footer from "@/components/Lapa/Footer";

function UpdateAnimalPage(){
    return(
        <div>
            <Header03/> 
            <SubHeaderGeral/>
            <TipoTutor/>
            <Footer/>
        </div>
    )
}

export default UpdateAnimalPage;
