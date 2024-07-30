import React from "react";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import { Header03 } from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import GerenciarTutores from "@/components/Lapa/CadastrosGerais/Tutor/GerenciarTutores";

function GerenciarEspeciesPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral/>
            < GerenciarTutores />
            < Footer />
        </div>

    );
}

export default GerenciarEspeciesPage;
