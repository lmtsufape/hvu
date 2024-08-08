import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03} from "../../../src/components/Lapa/Header";
import Footer from "../../../src/components/Lapa/Footer";
import CadastrosGeraisLaudos from "@/components/Lapa/CadastrosGerais";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";

function CadastrosGeraisPage() {
    return (
        <>
        <div>
            < Header03 />
            < SubHeaderGeral />
            < CadastrosGeraisLaudos />
            < Footer />
        </div>

        </>
    );
}

export default CadastrosGeraisPage;
