import React from "react";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import GerenciarEstagiarios from "@/components/Lapa/CadastrosGerais/Estagiario/GerenciarEstagiarios";
import { Header03 } from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";

function GerenciarEspeciesPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral/>
            < GerenciarEstagiarios />
            < Footer />
        </div>

    );
}

export default GerenciarEspeciesPage;
