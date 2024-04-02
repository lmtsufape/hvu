import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import { SubHeader02 } from "@/components/SubHeader";
import Footer from "../../src/components/Footer";
import AgendamentoEspecial from "../../src/components/AgendamentoEspecial"

function AgendamentoEspecialPage(){
    return(
        <div>
            <Header03/>
            <SubHeader02/>
            <AgendamentoEspecial/>
            <Footer/>
        </div>
    )
}

export default AgendamentoEspecialPage;