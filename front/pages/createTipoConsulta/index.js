import React from "react";
import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import CreateTipoConsulta from "../../src/components/CreateTipoConsulta";
import Footer from "../../src/components/Footer";

function CreateTipoConsultaPage() {
    return(
        <div>
            < Header03 />
            < SubHeader />
            < CreateTipoConsulta />
            < Footer />
        </div>
    );
}

export default CreateTipoConsultaPage;