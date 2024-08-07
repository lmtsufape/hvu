import React from "react";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import { Header03 } from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import GerenciarMedicos from "@/components/Lapa/CadastrosGerais/Medico/GerenciarMedicos";

function GerenciarEspeciesPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral/>
            < GerenciarMedicos />
            < Footer />
        </div>

    );
}

export default GerenciarEspeciesPage;
