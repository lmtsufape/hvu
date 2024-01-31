import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03} from "../../../src/components/Lapa/Header";
import Footer from "../../../src/components/Lapa/Footer";
import TelaHomeLaudos from "../../../src/components/Lapa/TelaPrincipalLaudos";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";

function TelaPrincipalLaudosPage() {
    return (
        <>
        <div>
            < Header03 />
            < SubHeaderGeral />
            < TelaHomeLaudos />
            < Footer />
        </div>

        </>
    );
}

export default TelaPrincipalLaudosPage
