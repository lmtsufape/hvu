import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import GerenciaPatologista from "@/components/Lapa/Administration/AdmPatologista";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";


function GerenciaPatologistaPage() {
    return (
        <div>
            <Header03 />
            <SubHeaderGeral/>
            <GerenciaPatologista />
            <Footer />
        </div>
    );
}

export default GerenciaPatologistaPage;
 