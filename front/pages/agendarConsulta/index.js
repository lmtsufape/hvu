import React from "react";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import AgendarConsulta from "../../src/components/AgendarConsulta"

function AgendarConsultaPage(){
    return(
        <div>
            <Header03/>

            <AgendarConsulta/>
            <Footer/>
        </div>
    )
}

export default AgendarConsultaPage;