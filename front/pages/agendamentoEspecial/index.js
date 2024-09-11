import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import { SubHeader } from "@/components/SubHeader";
import Footer from "../../src/components/Footer";
import AgendamentoEspecial from "../../src/components/AgendamentoEspecial"
import "@/styles/styles.css";

function AgendamentoEspecialPage(){
    return(
        <div className="divPai">
            <Header03/>
            <SubHeader/>
            <div className="flexStyle">
            <AgendamentoEspecial/>
            </div>
            <Footer/>
        </div>
    )
}

export default AgendamentoEspecialPage;