import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import { SubHeader02 } from "@/components/SubHeader";
import UpdateAnimalBySecretario from "../../src/components/UpdateAnimalBySecretario"
import Footer from "../../src/components/Footer";

function UpdateAnimalPage(){
    return(
        <div>
            <Header03/> 
            <SubHeader02/>
            <UpdateAnimalBySecretario/>
            <Footer/>
        </div>
    )
}

export default UpdateAnimalPage;
