import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { SubHeader } from "@/components/SubHeader";
import AgendamentoTutor from "@/components/MeusAgendamentos/index";

export default function MeusAgendamentos(){
    return(
        <div>
            < Header03 />
            < SubHeader />
            < AgendamentoTutor />
            < Footer />
        </div>
    )
}
