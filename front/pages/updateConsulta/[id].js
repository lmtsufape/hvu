import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import { SubHeader } from "@/components/SubHeader";
import Footer from "../../src/components/Footer";
import UpdateConsulta from "../../src/components/UpdateConsulta"

function UpdateConsultaPage(){
    return(
        <div>
            <Header03/>
            <SubHeader/>
            <UpdateConsulta/>
            <Footer/>
        </div>
    )
}

export default UpdateConsultaPage;