import React from "react";
import { Header03} from "@/components/Lapa/Header";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import CreateRaca from "@/components/Lapa/CadastrosGerais/Raca/CreateRaca";
import Footer from "@/components/Lapa/Footer";

function CreateRacaPage() {
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < CreateRaca />
            < Footer />
        </div>
    );
}

export default CreateRacaPage;