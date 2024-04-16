import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import {SubHeader02} from "../../src/components/SubHeader";
import PacientesByMedico from "../../src/components/PacientesByMedico";

function PacientesByMedicoPage() {
    return (
        <div>
            < Header03 />
            < SubHeader02 />
            < PacientesByMedico />
            < Footer />
        </div>
    );
}

export default PacientesByMedicoPage;
