import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import { SubHeader } from "@/components/SubHeader";
import UpdateAnimalByTutor from "../../src/components/UpdateAnimalByTutor"
import Footer from "../../src/components/Footer";

function UpdateAnimalPage(){
    return(
        <div>
            <Header03/> 
            <SubHeader/>
            <UpdateAnimalByTutor/>
            <Footer/>
        </div>
    )
}

export default UpdateAnimalPage;
