import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import {SubHeader} from "../../src/components/SubHeader";
import PacientesByMedico from "../../src/components/PacientesByMedico";
import "@/styles/styles.css";

function PacientesByMedicoPage() {
    return (
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                < PacientesByMedico />
            </div>
            < Footer />
        </div>
    );
}

export default PacientesByMedicoPage;
