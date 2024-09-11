import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03 } from "@/components/Lapa/Header";
import { SubHeaderGeral } from "@/components/Lapa/SubHeader"; 
import UpdateAnimalByTutor from "@/components/Lapa/CadastrosGerais/Animal/UpdateAnimalByTutor";
import Footer from "@/components/Lapa/Footer";

function UpdateAnimalPage(){
    return(
        <div>
            <Header03/> 
            <SubHeaderGeral/>
            <UpdateAnimalByTutor/>
            <Footer/>
        </div>
    )
}

export default UpdateAnimalPage;
