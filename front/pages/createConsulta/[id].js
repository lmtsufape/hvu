import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import { SubHeader } from "@/components/SubHeader";
import Footer from "../../src/components/Footer";
import CreateConsulta from "../../src/components/CreateConsulta"
import "@/styles/styles.css"

function CreateConsultaPage(){
    return(
        <div className="divPai">
            <Header03/>
            <SubHeader/>
            <div className="flexStyle">
                <CreateConsulta/>
            </div>
            <Footer/>
        </div>
    )
}

export default CreateConsultaPage;