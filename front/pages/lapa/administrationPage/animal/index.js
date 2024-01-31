import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import GerenciaAnimal from "@/components/Lapa/Administration/AdmAnimais";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";


function GerenciaAnimalPage() {
    return (
        <div>
            <Header03 />
            <SubHeaderGeral/>
            <GerenciaAnimal />
            <Footer />
        </div>
    );
}

export default GerenciaAnimalPage;
