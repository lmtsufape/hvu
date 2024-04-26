import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { SubHeader02 } from "@/components/SubHeader";
import AgendamentosByMedico from "../../src/components/AgendamentosByMedico";

export default function AgendamentosByMedicoPage(){
    return(
        <div>
            < Header03 />
            < SubHeader02 />
            < AgendamentosByMedico />
            < Footer />
        </div>
    )
}
