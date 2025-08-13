import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import GetAllPatologista from "@/components/Lapa/GerenciarPatologistas/GetAllPatologista";
import { Header03} from "../../../../src/components/Lapa/Header"
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import Footer from "../../../../src/components/Lapa/Footer";
import "@/styles/styles.css"

function GetAllPatologistaPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < GetAllPatologista />
            < Footer />
        </div>
    )
}

export default GetAllPatologistaPage;
