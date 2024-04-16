import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import {SubHeader02} from "../../src/components/SubHeader";
import PacientesBySecretario from "../../src/components/PacientesBySecretario";

function PacientesBySecretarioPage() {
    return (
        <div>
            < Header03 />
            < SubHeader02 />
            < PacientesBySecretario />
            < Footer />
        </div>
    );
}

export default PacientesBySecretarioPage;
