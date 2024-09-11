import React from "react";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import AgendarConsulta from "../../src/components/AgendarConsulta"
import { SubHeader } from "@/components/SubHeader";

import "@/styles/styles.css"

function AgendarConsultaPage(){
    return(
        <div className="divPai">
            <Header03/>
            < SubHeader />
            <div className="flexStyle">
                <AgendarConsulta/>
            </div>
            <Footer/>
        </div>
    )
}

export default AgendarConsultaPage;