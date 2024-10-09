import React from "react";
import { Header03} from "@/components/Lapa/Header";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import CreateEspecialidade from "@/components/Lapa/CadastrosGerais/Especialidade/CreateEspecialidade";
import Footer from "@/components/Lapa/Footer";

function CreateEspecialidadePage() {
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < CreateEspecialidade />
            < Footer />
        </div>
    );
}

export default CreateEspecialidadePage;