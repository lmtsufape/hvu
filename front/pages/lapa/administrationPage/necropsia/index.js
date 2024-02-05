import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import GerenciaNecropsia from "@/components/Lapa/Administration/AdmNecropsias";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";


function GerenciaNecropsiaPage() {
    return (
        <div>
            <Header03 />
            <SubHeaderGeral/>
            <GerenciaNecropsia />
            <Footer />
        </div>
    );
}

export default GerenciaNecropsiaPage;
