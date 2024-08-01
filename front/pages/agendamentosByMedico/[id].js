import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { SubHeader } from "@/components/SubHeader";
import AgendamentosByMedico from "../../src/components/AgendamentosByMedico";
import "@/styles/styles.css"; 

export default function AgendamentosByMedicoPage(){
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                < AgendamentosByMedico />
            </div>
            < Footer />
        </div>
    )
}
