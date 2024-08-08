import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import CreateMedicoLAPA from "@/components/Lapa/CreateMedicoFormLapa";

function CreateMedicoLapaPage(){
    return(
        <div>
            < Header03 />
            < CreateMedicoLAPA />
            < Footer />
        </div>
    )
}

export default CreateMedicoLapaPage;
