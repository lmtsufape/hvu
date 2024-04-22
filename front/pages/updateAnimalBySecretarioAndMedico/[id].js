import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import { SubHeader02 } from "@/components/SubHeader";
import UpdateAnimalBySecretarioAndMedico from "../../src/components/UpdateAnimalBySecretarioAndMedico"
import Footer from "../../src/components/Footer";

function UpdateAnimalPage(){
    return(
        <div>
            <Header03/> 
            <SubHeader02/>
            <UpdateAnimalBySecretarioAndMedico/>
            <Footer/>
        </div>
    )
}

export default UpdateAnimalPage;
