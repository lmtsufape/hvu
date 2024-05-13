import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import {SubHeader} from "../../src/components/SubHeader";
import PacientesBySecretario from "../../src/components/PacientesBySecretario";

function PacientesBySecretarioPage() {
    return (
        <div>
            < Header03 />
            < SubHeader />
            < PacientesBySecretario />
            < Footer />
        </div>
    );
}

export default PacientesBySecretarioPage;
