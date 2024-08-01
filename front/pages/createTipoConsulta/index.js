import React from "react";
import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import CreateTipoConsulta from "../../src/components/CreateTipoConsulta";
import Footer from "../../src/components/Footer";
import "@/styles/styles.css";

function CreateTipoConsultaPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                < CreateTipoConsulta />
            </div>
            < Footer />
        </div>
    );
}

export default CreateTipoConsultaPage;