import React from "react";
import { Header03} from "@/components/Lapa/Header";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import Footer from "@/components/Lapa/Footer";
import CreateTutorEnderecoFormLapa from "@/components/Lapa/CadastrosGerais/Tutor/CreateTutor";

function CreateTutorEnderecoFormLapaPage() {
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < CreateTutorEnderecoFormLapa />
            < Footer />
        </div>
    );
}

export default CreateTutorEnderecoFormLapaPage;