import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CreatePatologista from "@/components/Lapa/GerenciarPatologistas/CreatePatologista";
import { Header03} from "../../../../src/components/Lapa/Header"
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import Footer from "../../../../src/components/Lapa/Footer";
import "@/styles/styles.css"

function CreatePatologistaPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < CreatePatologista />
            < Footer />
        </div>
    )
}

export default CreatePatologistaPage;
