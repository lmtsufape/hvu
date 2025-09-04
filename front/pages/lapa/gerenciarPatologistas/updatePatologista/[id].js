import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import UpdatePatologista from "@/components/Lapa/GerenciarPatologistas/UpdatePatologista";
import { Header03} from "../../../../src/components/Lapa/Header"
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import Footer from "../../../../src/components/Lapa/Footer";
import "@/styles/styles.css"

function UpdatePatologistaPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < UpdatePatologista />
            < Footer />
        </div>
    )
}

export default UpdatePatologistaPage;
