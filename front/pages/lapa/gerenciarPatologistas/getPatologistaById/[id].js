import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import GetPatologistaById from "@/components/Lapa/GerenciarPatologistas/GetPatologistaById";
import { Header03} from "../../../../src/components/Lapa/Header"
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import Footer from "../../../../src/components/Lapa/Footer";
import "@/styles/styles.css"

function GetPatologistaByIdPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < GetPatologistaById />
            < Footer />
        </div>
    )
}

export default GetPatologistaByIdPage;
