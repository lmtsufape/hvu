import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import GerenciaVeterinario from "@/components/Lapa/Administration/AdmVeterinarios";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";


function GerenciaVeterinarioPage() {
    return (
        <div>
            <Header03 />
            <SubHeaderGeral/>
            <GerenciaVeterinario />
            <Footer />
        </div>
    );
}

export default GerenciaVeterinarioPage;
 