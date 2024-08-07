import React from "react";
import { Header03} from "@/components/Lapa/Header";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import CreateEstagiario from "@/components/Lapa/CadastrosGerais/Estagiario/CreateEstagiario";
import Footer from "@/components/Lapa/Footer";

function CreateEstagiarioPage() {
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < CreateEstagiario />
            < Footer />
        </div>
    );
}

export default CreateEstagiarioPage;