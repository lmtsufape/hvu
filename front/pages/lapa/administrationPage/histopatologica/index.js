import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import GerenciaHistopatologica from "@/components/Lapa/Administration/AdmHistopatologicas";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";


function GerenciaHistopatologicaPage() {
    return (
        <div>
            <Header03 />
            <SubHeaderGeral/>
            <GerenciaHistopatologica />
            <Footer />
        </div>
    );
}

export default GerenciaHistopatologicaPage;
 