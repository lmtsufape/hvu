import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import { SubHeader } from "@/components/SubHeader";
import Footer from "../../src/components/Footer";
import CreateConsulta from "../../src/components/CreateConsulta"

function CreateConsultaPage(){
    return(
        <div>
            <Header03/>
            <SubHeader/>
            <CreateConsulta/>
            <Footer/>
        </div>
    )
}

export default CreateConsultaPage;