import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import UpdateAnimalForm from "../../src/components/UpdateAnimalTutorForm"
import Footer from "../../src/components/Footer";

function UpdateAnimalPage(){
    return(
        <div>
            <Header03/> 

            
            <UpdateAnimalForm/>
            <Footer/>
        </div>
    )
}

export default UpdateAnimalPage;
