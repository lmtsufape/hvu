import React from "react";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import CreateEspecie from "@/components/Lapa/CadastrosGerais/Especie/CreateEspecie";
import { Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";

function CreateEspeciePage() {
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < CreateEspecie />
            < Footer />
        </div>
    );
}

export default CreateEspeciePage;