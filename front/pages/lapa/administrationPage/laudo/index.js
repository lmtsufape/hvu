import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import GerenciaLaudo from "@/components/Lapa/Administration/AdmLaudos";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";


function GerenciaLaudoPage() {
    return (
        <div>
            <Header03 />
            <SubHeaderGeral/>
            <GerenciaLaudo />
            <Footer />
        </div>
    );
}

export default GerenciaLaudoPage;
