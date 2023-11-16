import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../src/components/Header/header";
import Footer from "../src/components/Footer/Footer";
import {SegundaHeader02} from "../src/components/AnotherHeader/anotherHeader";
import ListarAnimais from "../src/components/ConsultarAnimalSecretario/listaAnimaisSecretario";

function PageConsultarAnimalSecretario() {
    return (
        <>
        <div>
            <Header03 />
        </div>

        <div>
            < SegundaHeader02 />
        </div>

        <div>
            < ListarAnimais />
        </div>

        <div>
            <Footer />
        </div>
        </>
    );
}

export default PageConsultarAnimalSecretario
