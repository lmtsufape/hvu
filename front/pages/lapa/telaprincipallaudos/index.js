import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03} from "../../../src/components/Lapa/Header";
import Footer from "../../../src/components/Lapa/Footer";
import TelaHomeLaudos from "../../../src/components/Lapa/TelaPrincipalLaudos";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import "@/styles/styles.css";

function TelaPrincipalLaudosPage() {
    return (
        <>
        <div className="divPai">
            < Header03 />
            < SubHeaderGeral />
            <div className="flexStyle">
            < TelaHomeLaudos />
            </div>
            < Footer />
        </div>

        </>
    );
}

export default TelaPrincipalLaudosPage
