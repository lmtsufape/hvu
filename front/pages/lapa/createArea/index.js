import React from "react";
import { Header03} from "@/components/Lapa/Header";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import CreateArea from "@/components/Lapa/CadastrosGerais/Area/CreateArea";
import Footer from "@/components/Lapa/Footer";

function CreateAreaPage() {
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < CreateArea />
            < Footer />
        </div>
    );
}

export default CreateAreaPage;