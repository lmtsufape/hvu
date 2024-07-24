import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03 } from "../../src/components/Header";
import Breadcrumbs from "../../src/components/Breadcrumbs"
import Footer from "../../src/components/Footer";
import { SubHeader } from "@/components/SubHeader";
import AgendamentoTutor from "@/components/MeusAgendamentos/index";
import "@/styles/styles.css";

export default function MeusAgendamentos() {
    return (
        <div className='divPai'>
            < Header03 />
            < SubHeader />
            < Breadcrumbs />
            <div className='divCentral'>
                <AgendamentoTutor />
            </div>
            < Footer />
        </div>
    )
}
