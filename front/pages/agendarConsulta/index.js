import React from "react";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import AgendarConsulta from "../../src/components/AgendarConsulta"
import { SubHeader01 } from "@/components/SubHeader";

function AgendarConsultaPage(){
    return(
        <div>
            <Header03/>
            < SubHeader01 />
            <AgendarConsulta/>
            <Footer/>
        </div>
    )
}

export default AgendarConsultaPage;