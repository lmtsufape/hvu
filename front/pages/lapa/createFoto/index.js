import React from "react";
import { Header03} from "@/components/Lapa/Header";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import CreateFoto from "@/components/Lapa/CadastrosGerais/Foto/CreateFoto";
import Footer from "@/components/Lapa/Footer";

function CreateFotoPage() {
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < CreateFoto />
            < Footer />
        </div>
    );
}

export default CreateFotoPage;