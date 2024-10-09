import React from "react";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import GerenciarEspecies from "@/components/Lapa/CadastrosGerais/Especie/GerenciarEspecies";
import { Header03 } from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";

function GerenciarEspeciesPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral/>
            < GerenciarEspecies />
            < Footer />
        </div>

    );
}

export default GerenciarEspeciesPage;
