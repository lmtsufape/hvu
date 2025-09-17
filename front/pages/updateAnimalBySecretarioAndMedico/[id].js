import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import { SubHeader } from "@/components/SubHeader";
import UpdateAnimalBySecretarioAndMedico from "../../src/components/UpdateAnimalBySecretarioAndMedico"
import Footer from "../../src/components/Footer";
import { SubHeaderGeral } from "../../src/components/Lapa/SubHeader";
import { getRoles } from "../../services/userService";

function UpdateAnimalPage(){
    const role = getRoles();

    return(
        <div>
            <Header03/> 

            {role.includes("medico") ? (
                <SubHeader />
            ) : role.includes("patologista") ? (
                <SubHeaderGeral />
            ) : null}
            
            <UpdateAnimalBySecretarioAndMedico/>
            <Footer/>
        </div>
    )
}

export default UpdateAnimalPage;
