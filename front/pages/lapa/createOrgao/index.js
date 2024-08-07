import React from "react";
import { Header03} from "@/components/Lapa/Header";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import CreateOrgão from "@/components/Lapa/CadastrosGerais/Orgao/CreateOrgao";
import Footer from "@/components/Lapa/Footer";

function CreateFotoPage() {
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < CreateOrgão />
            < Footer />
        </div>
    );
}

export default CreateFotoPage;